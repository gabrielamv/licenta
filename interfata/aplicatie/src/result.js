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
import { ArrowBendUpLeft, X, DownloadSimple } from "phosphor-react-native";
import DetaliiSimbol from "./detalii_simbol"; 


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoredImage, fromGallery, models, simboluri } = route.params;
  console.log("SIMBOLURI", simboluri);

  const [infoMessage, setinfoMessage] = useState(null);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.95)).current;

  ///cod nou adaugta 18 iunie
const [selectedSymbol, setSelectedSymbol] = useState(null);       // popup
const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

//---------

const simboluriCuUri = (simboluri || []).map(s => ({
  ...s,
  uri: `http://192.168.0.100:80/static/motive/${s.id_imagine}`,
}))

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

  useEffect(() => {
    Image.getSize(restoredImage, (w, h) => setImageSize({ width: w, height: h }));
  }, [restoredImage]);

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
        models: models || [],
      };

      array.push(newEntry);
      await AsyncStorage.setItem("restaurari", JSON.stringify(array));
      setinfoMessage("Imagine salvată în galerie!");
    } catch (e) {
      console.log("Eroare la salvare:", e);
      setinfoMessage("A apărut o eroare la salvarea imaginii.");
    }
  };

  console.log(models)

  const baseScale = SCREEN_WIDTH / imageSize.width;   // imaginea e „contain” pe lățime
  const dotData = (models || []).map((m) => ({
...m,
  px: m.x * baseScale,   // coordonate în pixeli pe ecran
  py: m.y * baseScale,
}));
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        {fromGallery ? (
          <X size={26} color="#4c1f1f" weight="light" />
        ) : (
          <ArrowBendUpLeft size={30} color="#4c1f1f" weight="light" />
        )}

      </TouchableOpacity>

      <GestureHandlerRootView style={{ flex: 1 }}>


      {/* //////prima varianta comentata----- */}


        {/* <PanGestureHandler onGestureEvent={panHandler}>
          <Animated.View style={{ flex: 1 }}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.Image
                source={{ uri: restoredImage }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
              />

             

              {dotData.map((dot, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedSymbol(dot)}
                  style={[
                  styles.dot,
                  { left: dot.px - 8, top: dot.py - 8 }, // -8 pt. a centra cercul (16 px diametru)
                  ]}
                />
              ))}


            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler> */}


        {/* /////----------------a doua varianta comentata----- */}


{/* 
        <PanGestureHandler onGestureEvent={panHandler}>
          <Animated.View style={{ flex: 1 }}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View style={{ flex: 1 }}>
                <Animated.Image
                  source={{ uri: restoredImage }}
                  style={[styles.image, animatedStyle]}
                  resizeMode="contain"
                />
                {dotData.map((dot, idx) => (
                  <TouchableOpacity
                    key={idx}
                    // onPress={() => setSelectedSymbol(dot)}

                    onPress={() => {
                      // const simbolComplet = simboluri.find(s => s.nume === dot.label);
                      const simbolComplet = simboluriCuUri.find(s => s.nume.toLowerCase().trim() === dot.label.toLowerCase().trim());

                      setSelectedSymbol(simbolComplet);
                    }}

                    style={[
                      styles.dot,
                      { left: dot.px - 8, top: dot.py - 8 },
                    ]}
                  />
                ))}
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler> */}


            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View style={{ flex: 1 }}>
                <Animated.Image
                  source={{ uri: restoredImage }}
                  style={[styles.image, animatedStyle]}
                  resizeMode="contain"
                />
              </Animated.View>
            </PinchGestureHandler>

            {/* Bulinele separat, peste imagine */}
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {dotData.map((dot, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {

                    const normalizare = str => 
                      str.toLowerCase().trim()
                      .normalize("NFD") //descompune carcaterele accentuate
                      .replace(/[\u0300-\u036f]/g, ""); // elimina diacriticele


                    const simbolComplet = simboluriCuUri.find(s =>
                      // s.nume.toLowerCase().trim() === dot.label.toLowerCase().trim()
                      normalizare(s.nume) === normalizare(dot.label)
                    );

                    console.log("CLICK BULINA:", dot.label, simbolComplet);
                    console.log("CLICK BULINA:", dot.label);
                    console.log("CĂUTARE ÎN simboluriCuUri:", simboluriCuUri.map(s => s.nume));

                    setSelectedSymbol(simbolComplet);
                  }}
                  style={[
                    styles.dot,
                    {
                      left: dot.px - 8,
                      top: dot.py - 8,
                    },
                  ]}
                />
              ))}
            </View>

      </GestureHandlerRootView>

      {!fromGallery && (
        <Pressable
          onPress={saveToGallery}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { backgroundColor: "#e6c7aa" },
          ]}
        >
          <DownloadSimple size={24} color="#4c1f1f" weight="light" style={{ marginRight: 8 }} />

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


      {/* {selectedSymbol && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>{selectedSymbol.label}</Text>
            <Text style={styles.popupCoords}>
              X: {selectedSymbol.x.toFixed(1)}   Y: {selectedSymbol.y.toFixed(1)}
            </Text>

            <TouchableOpacity
              style={styles.popupClose}
              onPress={() => setSelectedSymbol(null)}
            >
            <Text style={{ color: "#4c1f1f", fontWeight: "bold" }}>Închide</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      <DetaliiSimbol simbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />



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

  dot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#d60000",  // roșu vizibil
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 50,
  },

  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  popupBox: {
    backgroundColor: "#f5e9d6",
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#4c1f1f",
    alignItems: "center",
    maxWidth: "80%",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4c1f1f",
    marginBottom: 10,
  },
  popupCoords: {
    fontSize: 16,
    color: "#4c1f1f",
    marginBottom: 14,
  },

  popupClose: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "#e6c7aa",
    borderRadius: 10,
  },


});

export default Result;
