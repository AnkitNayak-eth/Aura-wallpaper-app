import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ImageHit } from "../../types";
import { Image } from "expo-image";
import { useState } from "react";
import { theme } from "../../constants/theme";
import { Platform } from "expo-modules-core";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type ImageScreenProps = ImageHit & Record<string, string | string[]>

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams<ImageScreenProps>();
  const [status, setStatus] = useState('loading');

  const onLoad = () => {
    setStatus('');
  };

  const downloadFile = async () => {
    try {
      const fileName = item.previewURL?.split('/').pop();
      const imageUrl = item.webformatURL!;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      return uri;
    } catch (err) {
      if (err instanceof Error && 'message' in err) {
        console.log('got error: ', err.message);
        Alert.alert('Image', err.message);
      }

      return null;
    }
  }

  const showToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  }

  const handleDownloadImage = async () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a');
      anchor.href = item.webformatURL!;
      anchor.target = "_blank";
      anchor.download = item.previewURL?.split('/').pop() || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    setStatus('downloading');
    const uri = await downloadFile();

    if (uri) {
      showToast('Image downloaded');
    }

    setStatus('');
  };

  const handleShareImage = async () => {
    if (Platform.OS === 'web') {
      showToast('Link copied!');
      return;
    }

    setStatus('sharing');
    const uri = await downloadFile();

    if (uri) {
      await Sharing.shareAsync(uri);
    }

    setStatus('');
  };

  const getSize = () => {
    if (!item.imageWidth || !item.imageHeight) {
      return {
        width: 200,
        height: 200
      }
    }


    const aspectRatio = item.imageWidth / item.imageHeight;
    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
    const calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    }
  }

  const toastConfig: ToastConfig = {
    success: ({ text1 }) => {
      return (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      )
    }
  }

  const uri = item.webformatURL;

  return (
    <BlurView
      style={styles.container}
      tint="dark"
      intensity={60}
    >
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === 'loading' && <ActivityIndicator size="large" color="white" />}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
          source={uri}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'sharing' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous'
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  } as TextStyle,
});

export default ImageScreen;
