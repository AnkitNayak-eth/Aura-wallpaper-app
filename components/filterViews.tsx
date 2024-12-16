import { Pressable, StyleSheet, Text, View } from "react-native";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { FC, ReactElement } from "react";

export interface IContent {
  data: string[];
  filters: Record<string, string> | null,
  setFilters: (filters: Record<string, string> | null) => void;
  filterName: string;
}

interface ISectionViewProps {
  title: string;
  content: ReactElement;
}

export const SectionView: FC<ISectionViewProps> = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>
        {content}
      </View>
    </View>
  )
}

export const CommonFilterRow: FC<IContent> = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  }

  return (
    <View style={styles.flexRowWrap}>
      {
        data && data.map((item, index) => {
          const isActive = filters && filters[filterName] === item;
          const backgroundColor = isActive ? theme.colors.neutral(0.7) : 'white';
          const color = isActive ? 'white' : theme.colors.neutral(0.7);

          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={item}
              style={[styles.outlineButton, { backgroundColor }]}
            >
              <Text style={[{ color }]}>{capitalize(item)}</Text>
            </Pressable>
          )
        })
      }
    </View>
  );
};

export const ColorFilter: FC<IContent> = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  }

  return (
    <View style={styles.flexRowWrap}>
      {
        data && data.map((item, index) => {
          const isActive = filters && filters[filterName] === item;
          const borderColor = isActive ? theme.colors.neutral(0.4) : 'white';

          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={item}
            >
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          )
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8)
  } as TextStyle,
  flexRowWrap: {
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  outlineButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: 'continuous',
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: 'continuous'
  },
})
