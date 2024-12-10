import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import { ImageHit } from "@/types";
import ImagesGrid from "@/components/imageGrid";
import debounce from 'lodash/debounce';
import FiltersModal from "@/components/filtersModal";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useRouter } from "expo-router";

let page = 1;

const HomeScreen = () => {
  const searchInputRef = useRef<TextInput | null>(null);
  const modalRef = useRef<BottomSheetModalMethods>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [images, setImages] = useState<ImageHit[]>([])
  const [filters, setFilters] = useState<Record<string, string> | null>(null);
  const [isEndReached, setIsEndReached] = useState(false);

  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const fetchImages = useCallback(async (params: Record<string, string | number> = { page: 1 }, append = true) => {
    const res = await apiCall(params);

    if (res.success && res?.data?.hits) {
      if (append) {
        setImages(prev => [...prev, ...res.data.hits]);
      } else {
        setImages(res.data.hits);
      }
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.clear();
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        const params: Record<string, string | number> = {
          page,
          ...filters,
        };

        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  }

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const openFiltersModal = () => {
    modalRef.current?.present();
  }

  const closeFiltersModal = () => {
    modalRef.current?.close();
  }

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);

      const params: Record<string, string | number> = {
        page,
        ...filters
      };

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;

      fetchImages(params, false);
    }
    closeFiltersModal();
  }

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);

      const params: Record<string, string | number> = {
        page,
      }

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    setFilters(null);
    closeFiltersModal();
  }

  const clearThisFilter = (filterName: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterName];
    setFilters(newFilters);
    page = 1;
    setImages([]);

    const params: Record<string, string | number> = {
      page,
      ...newFilters,
    }

    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleChangeCategory = (cat: string | null) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;

    const params: Record<string, string | number> = {
      page,
      ...filters,
    };

    if (cat) params.category = cat;

    fetchImages(params, false);
  }

  const handleSearch = (text: string) => {
    setSearch(text);

    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text === "") {
      page = 1
      searchInputRef.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const paddingTop = top > 0 ? top + 10 : 30;

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            Pixels
          </Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
          </View>
          <TextInput
            placeholder="Search for photos..."
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)} />
            </Pressable>
          )}
        </View>
        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {filters && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {Object.keys(filters).map((key) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === 'colors' ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                      <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
                    </Pressable>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        )}

        <View>
          {images.length > 0 ? <ImagesGrid images={images} router={router} /> : null}
        </View>

        <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9)
  } as TextStyle,
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7
  },
});

export default HomeScreen;
