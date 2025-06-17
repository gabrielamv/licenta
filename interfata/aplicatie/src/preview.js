import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from 'expo-image-manipulator';
//import DropDownPicker from 'react-native-dropdown-picker';
import {WandSparkles } from "lucide-react-native";
import Soare from "./soare";





const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;


const Preview = ({ route }) => {
  const { photoUri } = route.params;
  const navigation = useNavigation();
  const [selectedModel, setSelectedModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);

  //nou
  const fadeAnim = useRef(new Animated.Value(0)).current; // Inițial, opacitate 
  // Nou: Efect pentru a gestiona animația când showModelMenu se schimbă
    useEffect(() => {
      if (showModelMenu) {
        // Animație de fade in când meniul apare
        Animated.timing(fadeAnim, {
          toValue: 1, // Opacitate 1 (vizibil)
          duration: 200, // Durata animației în milisecunde
          useNativeDriver: true, // Folosește driverul nativ pentru performanță
        }).start();
      } else {
        // Animație de fade out când meniul dispare
        Animated.timing(fadeAnim, {
          toValue: 0, // Opacitate 0 (invizibil)
          duration: 150, // O durată puțin mai scurtă pentru dispariție
          useNativeDriver: true,
        }).start();
    }
  }, [showModelMenu, fadeAnim]); // Rulează efectul când showModelMenu sau fadeAnim se schimbă




const aiModels = [
  {
    nume: 'Superrezoluție',
    functie: '/ai/rezolutie'
  }, 
  {
    nume: 'Restaurare poză',
    functie: '/ai/restaurare'
  }
];


  const handleBack = () => {
    navigation.goBack();
  };

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setShowModelMenu(false); // închide meniul după alegere
    console.log(`Model AI selectat: ${modelId}`);
  };

  const renderModelItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modelItem,
        selectedModel === item && styles.selectedModelItem,
      ]}
      onPress={() => handleModelSelect(item)}
    >
      <Text style={styles.modelText}>{item}</Text>
    </TouchableOpacity>
  );

  async function saveToGalery(uri) {
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync("Povești Brodate");
    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      await MediaLibrary.createAlbumAsync("Povești Brodate", asset, false);
    }
  }

  async function compress_image(uri) {
    const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
            compress: 0.6, 
            format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      console.log("Imagine comprimată:", compressedImage.uri);
      return compressedImage.uri;
    }
  
  async function sendImage() {
    console.log("Butonul a fost apăsat");

    console.log("Imagine capturată:", photoUri);

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      console.log("Permisiunea pentru MediaLibrary nu a fost acordată");
      Alert.alert("Permisiunea pentru MediaLibrary este necesară.");
      return;
    }

    try {
      console.log("Comprimam imaginea")
      const compressedImage = await compress_image(photoUri);
      console.log("Începem salvarea în MediaLibrary...");
      await saveToGalery(compressedImage);
      console.log("Imagine salvată în galerie");

      const form = new FormData();
      form.append("image", {
        uri: compressedImage,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      form.append("selectedModel", selectedModel);

      console.log("FormData pregătit pentru upload");
      console.log("Trimit request spre server...");
      setIsLoading(true);
      const response = await fetch("http://192.168.0.100/upload/", {
        //const response = await fetch("http://172.18.160.1/upload/", {
          method: "POST",
        body: form,
      });

      console.log("Serverul a răspuns");
      console.log("Status response:", response.status);

      if (!response.ok) {
        console.log("Răspunsul nu este OK");
        Alert.alert("Eroare", "Eroare la trimiterea la server");
        return;
      }

      const result = await response.json();

      if ("eroare" in result) {
        console.log("Serverul a trimis o eroare:", result.eroare);
        Alert.alert("Eroare server", result.eroare);
      } else {
        console.log("Navighez către Result cu imaginea restaurată");

        setIsLoading(false);
        navigation.navigate("Result", { restoredImage: compressedImage });
      }
    } catch (error) {
      console.error("Eroare în sendImage:", error);
      Alert.alert("Eroare", "A apărut o problemă la trimiterea imaginii.");
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <TouchableOpacity onPress={handleBack} style={styles.cancelButton}>
        <Ionicons name="close" size={30} color="#4c1f1f" />
      </TouchableOpacity>

      <Text style={styles.text}>Preview:</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
        {/* <ActivityIndicator size="large" color="#00BFFF" /> */}
            <Soare/>
            <Text style={styles.loadingText}>Se procesează imaginea...</Text>
        </View>
        )}

      <Pressable
        onPress={sendImage}
        style = {({ pressed }) => [
          styles.sendButton,
          pressed && { backgroundColor: "#e6c7aa" }
        ]}
        >
        <Ionicons name="send" size={22} color="#4c1f1f"/>
        <Text style={styles.sendButtonText}>Trimite</Text>
      </Pressable>

      {/* Butonul de baghetă */}
      <TouchableOpacity
          onPress={() => setShowModelMenu(!showModelMenu)} 
          style={styles.sparkleButton}         
        >
          <WandSparkles size={24} color="#4c1f1f" style={{ marginLeft: 8 }} />
          <Text style = {styles.sparkleButtonText}>Model Ai</Text>
        </TouchableOpacity> 


        {showModelMenu && (
          <Animated.View  style={[styles.modelMenu, {opacity:fadeAnim}]}>
            {aiModels.map((model, index) => (
            <TouchableOpacity
              key={model.nume}
              onPress={() => {
              setSelectedModel(model);//TODO in loc de asta
              //facem fetch catre model.functie cu poza, pornim ecranul de loading (soarele)
              setShowModelMenu(false); // închide meniul după alegere
              }}
            style={[
            styles.modelItem,
            selectedModel === model && styles.selectedModelItem,
            index < aiModels.length - 1 && styles.modelItemBorderBottom, // adaugă bordură doar dacă nu este ultimul element
        ]}
        >
        <Text style={styles.modelText}>{model.nume}</Text>
      </TouchableOpacity>
    ))}
        </Animated.View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    position: "absolute",
    top: 25,
    left: 10,
    backgroundColor: "transparent",
    padding: 10,
    zIndex: 1, // asigură-te că e deasupra
  },

  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    position: "relative",
    backgroundColor: "black",
  },

  text: {
    fontSize: 20,
    marginBottom: 20,
  },

  image: {
    position: "absolute",
    top:0,
    left:0,
    flex: 1,
    width: "100%",
    height: "100%",
    //resizeMode: 'contain',
    resizeMode: "cover",
  },

  modelList: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  modelItem: {
    backgroundColor: "transparent", // culoare de fundal pentru fiecare model
    //opacity: 0.9, 
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    //marginHorizontal: 5,
    // marginVertical: 6,
    //borderBottomWidth: 1,
    //borderColor: "#d8c7b0", 
  },

  modelItemBorderBottom: { // NOU STIL
    borderBottomWidth: 1.3,
    borderColor: "#4c1f1f", // Culoarea bordurii subtile
  },

  selectedModelItem: {
    backgroundColor: "#e6c7aa", // culoare pentru modelul selectat
    borderWidth: 1.3,
  },

  modelText: {
    color: "#4c1f1f",
    fontSize: 18,
    fontFamily: "Spectral_300Light",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  
  loadingText: {
    color: "#F5E9D6",
    marginTop: 10,
    fontSize: 22,
    fontFamily: "DancingScript_400Regular",

  },

  sendButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5e9d6cc",
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 999,

  },

  sendButtonText:{
    color: "#4c1f1f",
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "500",
    fontFamily: "Spectral_300Light",
  },

  sparkleButton: {
    //marginTop: 10,
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#f5e9d6aa",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.3,
    borderColor: "#4c1f1f",
    top: 30,
    right: 10,
  },

  sparkleButtonText:{
    color: "#4c1f1f",
    marginLeft: 6,
    fontFamily: "Spectral_300Light",
    fontSize: 18,
  },

  modelMenu:{
    position: "absolute",
    top: 84,
    right: 10,
    backgroundColor: "#f5e9d6aa",
    //fie borderRadius=12, fie borderRadius=16 //trebuie sa ma mai decid
    borderRadius: 16,
    borderWidth: 1.3,
    borderColor: "#4c1f1f",
    minWidth: 170,
    //shadow IOS:
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    //shadow Android:
    elevation: 6,
    zIndex:1000,
  },
});

export default Preview;
