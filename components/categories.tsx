import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { data } from "@/constants/data";
import { FC } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import Animated, { FadeInRight } from "react-native-reanimated";

interface ICategoriesProps {
  handleChangeCategory: (cat: string | null) => void;
  activeCategory: string | null;
}

const Categories: FC<ICategoriesProps> = ({ activeCategory, handleChangeCategory }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={item => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          title={item}
          index={index}
          handleChangeCategory={handleChangeCategory}
        />
      )}
    />
  );
}

interface ICategoryProps {
  title: string;
  index: number,
  isActive: boolean,
  handleChangeCategory: (cat: string | null) => void;
}

const CategoryItem: FC<ICategoryProps> = ({ title, isActive, handleChangeCategory, index }) => {
  const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  const backgroundColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;

  return (
    <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    // backgroundColor: 'white',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
  } as TextStyle,
});

export default Categories;
