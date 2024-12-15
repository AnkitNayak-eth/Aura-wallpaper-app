import { StyleSheet, Text, View } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import { ImageHit } from "@/types";
import { FC } from "react";
import ImageCard from "@/components/imageCard";
import { getColumnsCount, wp } from "@/helpers/common";
import { ExpoRouter } from "expo-router/types/expo-router";

interface IImagesGrid {
  images: ImageHit[];
  router: ExpoRouter.Router;
}

const ImagesGrid: FC<IImagesGrid> = ({ images, router }) => {
  const columns = getColumnsCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => <ImageCard item={item} columns={columns} index={index} router={router} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 2,
    width: wp(100)
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  }
});

export default ImagesGrid;
