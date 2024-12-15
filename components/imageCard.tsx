import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { FC, useMemo } from "react";
import { ImageHit } from "@/types";
import { getImageSize, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { ExpoRouter } from "expo-router/types/expo-router";

interface ImageCardProps {
  item: ImageHit,
  index: number;
  columns: number;
  router: ExpoRouter.Router;
}

const ImageCard: FC<ImageCardProps> = ({ item, index, columns, router }) => {
  const getImageHeight = () => {
    const { imageHeight: height, imageWidth: width } = item;

    return { height: getImageSize(height, width) }
  }

  const isLastInRow = useMemo(() => {
    return (index + 1) % columns === 0;
  }, [index, columns]);

  return (
    <Pressable
      onPress={() => router.push({ pathname: 'home/image', params: { ...item } })}
      style={[styles.imageWrapper, !isLastInRow && styles.spacing]}
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={item.webformatURL}
        transition={100}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
  image: {
    height: 300,
    width: '100%'
  }
})

export default ImageCard;
