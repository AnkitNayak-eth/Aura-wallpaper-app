import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FC, RefObject } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BlurView } from "expo-blur";
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { data } from "@/constants/data";
import { ColorFilter, CommonFilterRow, IContent, SectionView } from "@/components/filterViews";

interface IFiltersModal {
  modalRef: RefObject<BottomSheetModalMethods>;
  setFilters: (filters: Record<string, string> | null) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  filters: Record<string, string> | null;
}

const FiltersModal: FC<IFiltersModal> = ({
  modalRef,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={['75%']}
      enablePanDownToClose
      backdropComponent={CustomBackDrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {
            Object.keys(sections).map((sectionName, index) => {
              const sectionView = sections[sectionName as keyof typeof sections];
              const sectionData = data.filters[sectionName as keyof typeof sections];
              const title = capitalize(sectionName);

              return (
                <Animated.View
                  key={sectionName}
                  entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                >
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName
                    })}
                  />
                </Animated.View>
              )
            })
          }

          <Animated.View
            style={styles.buttons}
            entering={FadeInDown.delay((500) + 100).springify().damping(11)}
          >
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset </Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const sections = {
  "order": (props: IContent) => <CommonFilterRow {...props} />,
  "orientation": (props: IContent) => <CommonFilterRow {...props} />,
  "type": (props: IContent) => <CommonFilterRow {...props} />,
  "colors": (props: IContent) => <ColorFilter {...props} />,
};

const CustomBackDrop: FC<BottomSheetBackdropProps> = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP);

    return {
      opacity
    }
  })
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ]
  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    flex: 1,
    // width: '100%',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  } as TextStyle,
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
  },
  buttonText: {
    fontSize: hp(2.2),
  },
})

export default FiltersModal;
