import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function CameraApp() {
  const [cameraType, setCameraType] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [splashscreen, setSplashscreen] = useState(true);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  async function requestPermissions() {
    console.log("cerem permisiuni");
    const cameraResp = await requestCameraPermission();
    const mediaResp = await requestMediaPermission();
    console.log("cameraResp", cameraResp);
    console.log("mediaResp", mediaResp);

    if (cameraResp.granted && mediaResp.granted) {
      console.log("Permissions granted for camera and media library.");
    }
  }

  useEffect(() => {
    if (splashscreen) {
      const timer = setTimeout(() => {
        setSplashscreen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [splashscreen]);

  if (splashscreen) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/final.png")} style={styles.logo} />
      </View>
    );
  }

  if (!cameraPermission?.granted || !mediaPermission?.granted) {
    return (
      <View style={styles.permissionsContainer}>
        <Text style={styles.message}>
          Aplicația are nevoie de următoarele permisiuni
        </Text>
        <Text style={styles.message}>•acces la cameră pentru a face poze</Text>
        <Text style={styles.message}>•acces la galerie pentru a salva pozele</Text>
        <Button onPress={requestPermissions} title="Permite accesul" />
      </View>
    );
  }

  function toggleCameraType() {
    setCameraType((prevType) => (prevType === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate("Preview", { photoUri: photo.uri });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef}>
        <TouchableOpacity onPress={takePicture} style={styles.cameraContentOut}>
          <View style={styles.cameraContentIn} />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContentOut: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 7,
    borderColor: "white",
  },

  cameraContentIn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "white",
  },

  message: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
  },

  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  permissionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
