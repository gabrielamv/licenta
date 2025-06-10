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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function CameraApp() {
  const [cameraType, setCameraType] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

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
          <View style={styles.cameraContentIn}>
            <Image source={require("../assets/logo_home.png")} style={styles.cameraLogo} />
          </View>
        </TouchableOpacity>
      </CameraView>

      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#f5e9d6" />
      </TouchableOpacity>

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
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.8,
    borderColor: "#4c1f1f",
  },

  cameraContentIn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f5e9d6",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#4c1f1f",
    borderWidth: 1,
  },

  message: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
  },

  permissionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  cameraLogo: {
    width:60,
    height: 60,
    resizeMode: "contain",
  },

  backButton: {
    position: "absolute",
    top: 5,
    left: 10,
    zIndex: 10,
    padding: 10,
  },


});
