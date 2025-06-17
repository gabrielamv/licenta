import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Animated as RNAnimated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  clamp,
} from "react-native-reanimated";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageDown } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoredImage, fromGallery } = route.params;

  const [infoMessage, setinfoMessage] = useState(null);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.95)).current;

  useEffect(() => {
    if (infoMessage) {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        RNAnimated.parallel([
          RNAnimated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          RNAnimated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setinfoMessage(null));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [infoMessage]);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const nextScale = clamp(ctx.startScale * event.scale, 1, 3);
      scale.value = nextScale;

      const scaleDiff = nextScale / ctx.startScale;
      const focalX = event.focalX - SCREEN_WIDTH / 2;
      const focalY = event.focalY - SCREEN_HEIGHT / 2;

      translateX.value = ctx.startX + (focalX - ctx.startX) * (1 - scaleDiff);
      translateY.value = ctx.startY + (focalY - ctx.startY) * (1 - scaleDiff);

      if (nextScale <= 1.01) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const scaledWidth = SCREEN_WIDTH * scale.value;
      const scaledHeight = SCREEN_HEIGHT * scale.value;
      const maxX = (scaledWidth - SCREEN_WIDTH) / 2;
      const maxY = (scaledHeight - SCREEN_HEIGHT) / 2;

      const x = ctx.startX + event.translationX;
      const y = ctx.startY + event.translationY;

      translateX.value = clamp(x, -maxX, maxX);
      translateY.value = clamp(y, -maxY, maxY);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleBack = () => {
    navigation.goBack();
  };

  const saveToGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem("restaurari");
      let array = stored ? JSON.parse(stored) : [];

      const newEntry = {
        uri: restoredImage,
        savedAt: Date.now(),
      };

      array.push(newEntry);
      await AsyncStorage.setItem("restaurari", JSON.stringify(array));
      setinfoMessage("Imagine salvată în galerie!");
    } catch (e) {
      console.log("Eroare la salvare:", e);
      setinfoMessage("A apărut o eroare la salvarea imaginii.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name={fromGallery ? "close" : "arrow-back"} size={30} color="#4c1f1f" />
      </TouchableOpacity>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler onGestureEvent={panHandler}>
          <Animated.View style={{ flex: 1 }}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.Image
                source={{ uri: restoredImage }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>

      {!fromGallery && (
        <Pressable
          onPress={saveToGallery}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { backgroundColor: "#e6c7aa" },
          ]}
        >
          <ImageDown size={20} color="#4c1f1f" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Salvează</Text>
        </Pressable>
      )}

      {infoMessage && (
        <RNAnimated.View
          style={[
            styles.messageBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.messageInnerBox}>
            <Text style={styles.messageText}>{infoMessage}</Text>
          </View>
        </RNAnimated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  saveButton: {
    position: "absolute",
    flexDirection: "row",
    bottom: 30,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#f5e9d6",
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: aspectRatio > 1.8 ? 12 : 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 20,
    color: "#4c1f1f",
    fontFamily: "Spectral_300Light",
    fontWeight: "500",
  },
  messageBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  messageInnerBox: {
    backgroundColor: "#f5e9d6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: "80%",
    alignItems: "center",
  },
  messageText: {
    color: "#4c1f1f",
    fontSize: 18,
    fontFamily: "CormorantGaramond_500Medium_Italic",
    textAlign: "center",
  },
});

export default Result;
