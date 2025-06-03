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
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const aiModels = ["Model 1", "Model 2", "Model 3", "Model 4"];

const Preview = ({ route }) => {
  const { photoUri } = route.params;
  const navigation = useNavigation();
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownHeight = useState(new Animated.Value(0))[0];

  //cod pentru DropDown
  const toggleDropdown = () => {
    if (showDropdown) {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowDropdown(false));
    } else {
      setShowDropdown(true);
      Animated.timing(dropdownHeight, {
        toValue: 60,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

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

  async function sendImage() {
    console.log("🟢 Butonul a fost apăsat");

    if (!selectedModel) {
      console.log("❌ Niciun model AI selectat");
      Alert.alert("Selectează un model AI înainte de a continua.");
      return;
    }

    console.log("📷 Imagine capturată:", photoUri);

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      console.log("❌ Permisiunea pentru MediaLibrary nu a fost acordată");
      Alert.alert("Permisiunea pentru MediaLibrary este necesară.");
      return;
    }

    try {
      console.log("🛠 Începem salvarea în MediaLibrary...");
      await saveToGalery(photoUri);
      console.log("💾 Imagine salvată în galerie");

      const form = new FormData();
      form.append("image", {
        uri: photoUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      form.append("selectedModel", selectedModel);

      console.log("📦 FormData pregătit pentru upload");
      console.log("📡 Trimit request spre server...");

      const response = await fetch("http://192.168.0.100/upload/", {
        method: "POST",
        body: form,
      });

      console.log("📥 Serverul a răspuns");
      console.log("🔍 Status response:", response.status);

      if (!response.ok) {
        console.log("❌ Răspunsul nu este OK");
        Alert.alert("Eroare", "Eroare la trimiterea la server");
        return;
      }

      const result = await response.json();

      if ("eroare" in result) {
        console.log("❗ Serverul a trimis o eroare:", result.eroare);
        Alert.alert("Eroare server", result.eroare);
      } else {
        console.log("🧭 Navighez către Result cu imaginea restaurată");
        console.log(
          "🔗 Imagine restaurată:",
          result.imagine.substring(0, 50) + "..."
        );
        const restoredUri = `${FileSystem.cacheDirectory}result.jpg`;
        await FileSystem.writeAsStringAsync(restoredUri, result.imagine, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await saveToGalery(restoredUri);
        navigation.navigate("Result", { restoredImage: restoredUri });
      }
    } catch (error) {
      console.error("🔥 Eroare în sendImage:", error);
      Alert.alert("Eroare", "A apărut o problemă la trimiterea imaginii.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <TouchableOpacity onPress={handleBack} style={styles.cancelButton}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <Text style={styles.text}>Preview:</Text>
      <Image source={{ uri: photoUri }} style={styles.image} />

      <View style={styles.dropdownToggleContainer}>
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

          <TouchableOpacity style={styles.applyButton} onPress={sendImage}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/*---------------------------------- */}

        {/*Drop-down*/}
        <Animated.View
          style={[styles.dropdownListContainer, { height: dropdownHeight }]}
        >
          {showDropdown && (
            <FlatList
              data={aiModels}
              renderItem={renderModelItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelList}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    color: "white",
    fontSize: 16,
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

  /*
    modelListContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 10,
        elevation: 10,
    }, */

  modelList: {
    paddingHorizontal: 10,
  },

  modelItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },

  selectedModelItem: {
    backgroundColor: "rgba(0, 150, 255, 0.6)",
  },

  modelText: {
    color: "white",
    fontSize: 14,
  },
});

export default Preview;
