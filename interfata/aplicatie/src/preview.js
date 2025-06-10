import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from 'expo-image-manipulator';
import DropDownPicker from 'react-native-dropdown-picker';

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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
  { label: 'Model 1', value: 'Model 1' },
  { label: 'Model 2', value: 'Model 2' },
  { label: 'Model 3', value: 'Model 3' },
  { label: 'Model 4', value: 'Model 4' },
]);

  //cod pentru DropDown
  // const toggleDropdown = () => {
  //   if (showDropdown) {
  //     Animated.timing(dropdownHeight, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: false,
  //     }).start(() => setShowDropdown(false));
  //   } else {
  //     setShowDropdown(true);
  //     Animated.timing(dropdownHeight, {
  //       toValue: 60,
  //       duration: 300,
  //       useNativeDriver: false,
  //     }).start();
  //   }
  // };

  //----------------------------

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
      Alert.alert("Selectează un model AI înainte de a continua.");
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
      const response = await fetch("http://192.168.1.191/upload/", {
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

        const restoredUri = `${FileSystem.cacheDirectory}result.jpg`;
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
        <Ionicons name="close" size={30} color="#f5e9d6" />
      </TouchableOpacity>

      <Text style={styles.text}>Preview:</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />
      {isLoading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00BFFF" />
            <Text style={styles.loadingText}>Se procesează imaginea...</Text>
        </View>
        )}
      {/* <View style={styles.dropdownToggleContainer}>
        <View style={styles.dropdownRow}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.dropdownToggleButton}
          >
            <Text style={styles.dropdownToggleText}>
              {selectedModel ? `Model: ${selectedModel}` : "Alege modelul AI"}
            </Text>
            <Ionicons
              name={showDropdown ? "chevron-down" : "chevron-up"}
              size={20}
              color="white"
            />
          </TouchableOpacity>

          {/* Buton dreapta ecran */}

          {/* <TouchableOpacity style={styles.applyButton} onPress={sendImage}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </TouchableOpacity>
        </View> */}

        {/*---------------------------------- */}

        {/*Drop-down*/}
        {/* <Animated.View
          style={[styles.dropdownListContainer, { height: dropdownHeight }]}
        >
          {showDropdown && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelList}
            >
            {aiModels.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modelItem,
                  selectedModel === item && styles.selectedModelItem,
                ]}
                onPress={() => handleModelSelect(item)}
              >
                <Text 
                  style={styles.modelText}>{item}
                </Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
          )}
        </Animated.View>
      </View> */} 

      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
          const selected = callback(value);
          setValue(selected);
          setSelectedModel(selected); // conectezi cu restul codului tău
        }}
        setItems={setItems}
        placeholder="Alege modelul AI"
        style={{ backgroundColor: '#f5e9d6', borderColor: '#4c1f1f' }}
        dropDownContainerStyle={{ backgroundColor: '#f5e9d6' }}
        labelStyle={{ color: '#4c1f1f', fontSize: 16, fontWeight: '500' }}
        placeholderStyle={{ color: '#4c1f1f' }}
      />
  </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: "absolute",
    top: aspectRatio > 1.8 ? 25 : 60, // ajustare pentru aspect ratio
    right: 10,
    zIndex: 1000,
    width: 160,

  },

  dropdown:{
    backgroundColor:"#f5e9d6",
    borderColor: "#4c1f1f",
    height: 40,
  },

  cancelButton: {
    position: "absolute",
    top: 0,
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
    fontFamily: "Lato_400Regular",
  },

  dropdownListContainer: {
    overflow: "hidden",
    marginTop: 5,
  
  
  },

  applyButton: {
    backgroundColor: "rgba(0, 150, 255, 0.6)",
    padding: 8,
    borderRadius: 25,
  },

  modelList: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  modelItem: {
    backgroundColor: "#f5e9d6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    
  },

  selectedModelItem: {
    backgroundColor: "#f5e9d6",
  },

  modelText: {
    color: "#4c1f1f",
    fontSize: 16,
    fontFamily: "Lato_400Regular",
    fontWeight: "500",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    zIndex: 999,

  },

  sendButtonText:{
    color: "#5a2a2a",
    fontsize: 16,
    marginLeft: 8,
    fontWeight: "500",
    fontFamily: "Lato_400Regular",
  }
  
});

export default Preview;
