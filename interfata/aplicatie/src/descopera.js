import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DetaliiSimbol from "./detalii_simbol";
import { ArrowBendUpLeft, X, DownloadSimple } from "phosphor-react-native";
import Constants from "expo-constants";



const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;

export default function Descopera ({route}) {

    const navigation = useNavigation();
    const [simbolSelectat, setSimbolSelectat] = useState(null);
    const simboluri = (route.params?.simboluri?.simboluri) || [];
    
    const simboluriCuUri = simboluri.map(simbol => ({
        ...simbol,
        uri: Constants.expoConfig.SERVER_URL+`/static/motive/${simbol.id_imagine}`
      }));
    


    const handleBack = () => {
        if (simbolSelectat) {
            setSimbolSelectat(null); // revenim la listă
          } else {
            navigation.goBack(); // ieșim din ecran
          }
      };

      const renderItem = ({ item }) => {
        if (!item || !item.uri) return null;

    return (   
        <Pressable
        onPress={() => setSimbolSelectat(item)}
        style={({ pressed }) => [
          styles.symbolWrapper,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
        ]}
      >
        <View style={styles.symbolBackround}>
          <Image
            source={{ uri: item.uri }}
            style={styles.symbolImage}
          />
        </View>
        <Text style={styles.symbolText}>{item.nume}</Text>
      </Pressable>

    );
};

  return (


    <View style={styles.container}>
  {/* Header */}
  <View style={styles.header}>
    <Text style={styles.title}>Simboluri</Text>
  </View>
  <View style={styles.separator} />

  <TouchableOpacity onPress={handleBack} style={styles.backButton}>
    {/* <Ionicons name="arrow-back" size={30} color="#4c1f1f" /> */}
    <ArrowBendUpLeft size={30} color="#4c1f1f" weight="light" />
  </TouchableOpacity>

  <FlatList
    data={simboluriCuUri}
    keyExtractor={(item, index) => `${item.id_imagine}-${index}`}
    renderItem={renderItem}
    numColumns={2}
    contentContainerStyle={{ padding: 8 }}
  />
  <DetaliiSimbol simbol={simbolSelectat} onClose={() => setSimbolSelectat(null)} />
</View>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5e9d6",
    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 14,
      marginTop: aspectRatio > 1.8 ? 25 : 10,
    },
    title: {
      fontFamily: "PlayfairDisplay_700Bold",
      fontSize: 28,
      fontWeight: "bold",
      color: "#4c1f1f",
      textAlign: "center",
    },
    separator: {
      alignSelf: "center",
      width: "90%",
      borderBottomWidth: 2,
      borderBottomColor: "#d8c7b0",
      marginBottom: 12,
    },
    backButton: {
      position: "absolute",
      top: 25,
      left: 10,
      zIndex: 10,
      padding: 10,
    },

    symbolWrapper:{
        flex: 1,
        margin: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    symbolBackround: {
        //backgroundColor: "#ece4d0",
        //backgroundColor: "#e6c7aa",
        //backgroundColor: "#e6d4b4",
        //backgroundColor: "#f3dec3",
        //backgroundColor: "#fdf6ec",
        //?? posibil backgroundColor: "#eae0cc",
        backgroundColor: "#e6d4b4",
        padding: 12,
        borderRadius: 12,
        elevation: 6, 
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        borderWidth: 0.5,
        borderColor: "#d8c7b0",
    },
    symbolImage:{
        width: screenWidth / 2 - 120,
        aspectRatio: 1, // păstrează aspectul imaginii
        //borderRadius: 10,
        resizeMode: "contain",
        //aspectRatio: 1, // păstrează aspectul imaginii
    },
    symbolText:{
        textAlign: "center",
        marginTop: 8,
        // fontFamily: "Lato_400Regular",
        // fontFamily: "PlayfairDisplay_400Regular",
        //fontFamily: "Spectral_300Light",
        //fontFamily: "EBGaramond-Regular",
        fontFamily:"Spectral_300Light_Italic",
        fontSize: 17,
        color: "#4c1f1f",
        lineHeight: 22,
        letterSpacing: 0.3,
    },
});