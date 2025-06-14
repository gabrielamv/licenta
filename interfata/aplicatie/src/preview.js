import React, { useEffect, useState } from "react";
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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownHeight = useState(new Animated.Value(0))[0];
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setinfoMessage] = useState(null);
  const fadeAnim = useState(new Animated.Value(0)).current; // pentru mesajul de info

  useEffect(() => {
    if(infoMessage){
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setinfoMessage(null)); // setează infoMessage la null după animație
      }, 3000); // afișează mesajul timp de 3 secunde
      return () => clearTimeout(timer); // curăță timer-ul la demontare
    }
  }, [infoMessage]);



// const aiModels = ['Îmbunătățire rezoluție', 'Îmbunătățire poză'];
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
const [showModelMenu, setShowModelMenu] = useState(false);


  const handleBack = () => {
    navigation.goBack();
  };

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
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
    return uri
    const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
            compress: 0.6, 
            format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return compressedImage.uri;
    }
  
  async function sendImage() {
    console.log("Butonul a fost apăsat");

    if (!selectedModel) {
      console.log("Niciun model AI selectat");
      //Alert.alert("Selectează un model AI înainte de a continua.");
      setinfoMessage("Selectează un model AI înainte de a continua.");
      return;
    }

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
        // const compressedImage = photoUri;
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

        //const restoredUri = `${FileSystem.cacheDirectory}result.jpg`;
        const restoredUri = `${FileSystem.cacheDirectory}result_${Date.now()}.jpg`;

        await FileSystem.writeAsStringAsync(restoredUri, result.imagine, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Imagine restaurată salvată local:", restoredUri);
        await saveToGalery(restoredUri);

        setIsLoading(false);
        navigation.navigate("Result", { restoredImage: restoredUri });
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

        {/* cod adaugat 14 iunie */}

        {/* {infoMessage && (  */}

          {/* <Animated.View style = {[styles.messageBox, {opacity: fadeAnim}]}>
          <TouchableOpacity
            onPress={() => setinfoMessage(null)}
              style={styles.closeButton}
            >
            <Ionicons name="close" size={20} color="#4c1f1f" />
            </TouchableOpacity>

            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#4c1f1f"
              style={{marginRight: 6}}
            />
            <Text style={styles.messageText}>{infoMessage}</Text>
            </View>
            </Animated.View> */}
        {/* )}   */}

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
          <Text style = {{color: "#4c1f1f", marginLeft: 6 }}Model Ai></Text>
        </TouchableOpacity> 


        {showModelMenu && (
          <View style={styles.modelMenu}>
            {aiModels.map((model) => (
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
        ]}
        >
        <Text style={styles.modelText}>{model.nume}</Text>
      </TouchableOpacity>
    ))}
      </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({


  dropdown:{
    backgroundColor:"#f5e9d6",
    borderColor: "#4c1f1f",
    height: 40,
    borderWidth: 1.3,
  },

  cancelButton: {
    position: "absolute",
    top: 15,
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

  dropdownToggleContainer: {
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    zIndex: 10,
    elevation: 10,
  },

  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownToggleButton: {
    backgroundColor: "#4c1f1f",
    //padding: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-between',
    marginRight: 10,
  },

  dropdownToggleText: {
    color: "#4c1f1f",
    fontSize: 18,
    backgroundColor:"#f5e9d6",
    //fontFamily: "PlayfairDisplay_400Regular",
    fontFamily: "CormorantGaramond_500Medium_Italic",
  },

  dropdownListContainer: {
    overflow: "hidden",
    marginTop: 5,
  
  
  },


  modelList: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  modelItem: {
    backgroundColor: "#f5e9d6",
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 10,
    //marginHorizontal: 5,
    marginVertical: 6,
    
  },

  selectedModelItem: {
    backgroundColor: "#e6c7aa", // culoare pentru modelul selectat
  },

  modelText: {
    color: "#4c1f1f",
    fontSize: 18,
    fontFamily: "CormorantGaramond_500Medium_Italic",
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
    backgroundColor: "#f5e9d6",
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 999,

  },

  sendButtonText:{
    color: "#5a2a2a",
    fontSize: 20,
    marginLeft: 8,
    fontWeight: "500",
    fontFamily: "CormorantGaramond_500Medium_Italic",
  },

  sparkleButton: {
    //marginTop: 10,
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#f5e9d6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderWidth: 1.3,
    borderColor: "#4c1f1f",
    top: 30,
    right: 10,
  },

  modelMenu:{
    position: "absolute",
    top: 76,
    right: 10,
    backgroundColor: "#f5e9d6",
    //fie borderRadius=12, fie borderRadius=16 //trebuie sa ma mai decid
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    //padding: 10,
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

  messageBox:{
    position: "absolute",
    bottom: 75,
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: "#f5e9d6",
    padding: 18,
    marginHorizontal:10,
    marginVertical:235,
    borderRadius: 16,
    borderColor: "#4c1f1f",
    borderWidth: 1.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 999,
  },

  messageText: {
    color: "#4c1f1f",
    fontSize: 18,
    fontFamily: "CormorantGaramond_500Medium_Italic",
    textAlign: "center",
    left: 3,
  },

  closeButton:{
    position: "absolute",
    top: 2,
    //right: 0,
    left: 0,
    //backgroundColor: "transparent",
    padding: 4,
    zIndex: 10, // asigură-te că e deasupra
  }



});

export default Preview;
