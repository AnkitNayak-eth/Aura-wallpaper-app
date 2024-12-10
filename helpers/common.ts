import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100;
}

export const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100;
}

export const getColumnsCount = () => {
  if (deviceWidth >= 1024) {
    return 4;
  }

  if (deviceWidth >= 768) {
    return 3;
  }

  return 2;
}

export const getImageSize = (height: number, width: number): number => {
  if (width > height) {
    return 250;
  }

  if (width < height) {
    return 300;
  }

  return 200;
}

export const capitalize = (str: string) => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
