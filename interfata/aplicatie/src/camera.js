import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { ArrowBendUpLeft, Image as ImageIcon } from "phosphor-react-native";




import * as ImagePicker from "expo-image-picker";


export default function CameraApp() {
  const [cameraType, setCameraType] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [simboluri, setSimboluri] = useState([]);

useEffect(() => {
  fetch("http://192.168.0.100:80/simboluri/")
    .then((res) => res.json())
    .then((data) => {
      console.log(">>> Am primit simboluri în Camera.js:", data.simboluri);
      setSimboluri(data.simboluri || []);
    })
    .catch((err) => {
      console.error("Eroare la fetch simboluri:", err);
    });
}, []);



  const handleBack = () => {
    navigation.goBack();
  };
  
  async function compress_image(uri) {
    const compressed = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.6,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return compressed.uri;
  }

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
      const compressUri = await compress_image(photo.uri);
      navigation.navigate("Preview", { photoUri: compressUri, simboluri:simboluri });
    }
  }

  async function pickImageFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const compressUri = await compress_image(result.assets[0].uri);
      navigation.navigate("Preview", { photoUri: compressUri, simboluri: simboluri });
    }
  }
  

  return (
    <View style={{ flex: 1 }}>
  {isFocused && (
      <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef}>
        <TouchableOpacity onPress={takePicture} style={styles.cameraContentOut}>
          <View style={styles.cameraContentIn}>
            <Image source={require("../assets/logo_home.png")} style={styles.cameraLogo} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImageFromGallery} style={styles.galleryButton}>
          <ImageIcon size={28} color="#4c1f1f" weight="light" />
        </TouchableOpacity>

      </CameraView>
      )}

      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ArrowBendUpLeft size={30} color="#4c1f1f" weight="light" />
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
    top: 25,
    left: 10,
    zIndex: 10,
    padding: 10,

  },

  galleryButton: {
    position: "absolute",
    bottom: 40,
    // top: 20,
    left: 30,
    backgroundColor: "#f5e9d6aa",
    padding: 10,
    borderRadius: 25,
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    zIndex: 10,
    height: 50,
    width: 50,
  },
  


});
