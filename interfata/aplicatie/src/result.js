import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withTiming,
    withSpring,
    clamp,
} from "react-native-reanimated";
import { PinchGestureHandler, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoredImage } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };
  console.log("Restored image URI:", restoredImage.substring(0, 50) + "...");

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

      // când faci zoom out aproape de 1, revino la centru
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

        {/* <Image source={{ uri: restoredImage }} style={styles.image} /> */}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  title: {
    //color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    //marginVertical: 20,
  },

  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    //resizeMode: 'contain',
    resizeMode: "cover",
  },

  backButton: {
    position: "absolute",
    top: 5,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
});

export default Result;
