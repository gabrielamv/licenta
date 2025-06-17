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



const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;

export default function Descopera ({route}) {

    const navigation = useNavigation();
    const [simbolSelectat, setSimbolSelectat] = useState(null);
    const simboluri = (route.params?.simboluri?.simboluri) || [];
    
    const simboluriCuUri = simboluri.map(simbol => ({
        ...simbol,
        uri: `http://192.168.0.100:80/static/motive/${simbol.id_imagine}`
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
    <Ionicons name="arrow-back" size={30} color="#4c1f1f" />
  </TouchableOpacity>

  <FlatList
    data={simboluriCuUri}
    keyExtractor={(item, index) => `${item.id_imagine}-${index}`}
    renderItem={renderItem}
    numColumns={2}
    contentContainerStyle={{ padding: 8 }}
  />

  <Modal
  visible={!!simbolSelectat}
  transparent
  animationType="fade"
  onRequestClose={() => setSimbolSelectat(null)}
>
  <View style={styles.modalOverlay}>
    {/* Zona transparentă pentru închidere */}
    <TouchableWithoutFeedback onPress={() => setSimbolSelectat(null)}>
      <View style={styles.modalBackdrop} />
    </TouchableWithoutFeedback>

    {/* Pop-up cu conținut scrollabil */}
    <View style={styles.modalContent}>
      <TouchableOpacity
        onPress={() => setSimbolSelectat(null)}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={36} color="#4c1f1f" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.modalScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: simbolSelectat?.uri }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{simbolSelectat?.nume}</Text>
            
 

        {simbolSelectat?.semnificatie && (
          <Text style={[styles.modalDescription, {alignSelf: "strech"}]}>
            Semnificație: {simbolSelectat.semnificatie}
          </Text>
        )}
        {simbolSelectat?.descriere && (
          <Text style={[styles.modalDescription, {alignSelf: "strech"}]}>
            Descriere: {simbolSelectat.descriere}
          </Text>
        )}
        {simbolSelectat?.regiuni && (
          <Text style={[styles.modalDescription, {alignSelf: "strech"}]}>
            Regiuni: {simbolSelectat.regiuni}
          </Text>
        )}
      </ScrollView>
    </View>
  </View>
</Modal>
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

    modalOverlay:{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    modalContent: {
        //backgroundColor: "rgba(255,255,255,0.7)",
        backgroundColor: "#f5e9d6",

        //COD ADAUGAT ACUM
        //paddingVertical:28,
        borderWidth: 1.5,
        borderColor: "#4c1f1f",
        //flex: 1,
        //---------------------

        borderRadius: 16,
        padding: 20,
        width: "90%",
        maxHeight: screenHeight*0.8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 8,

      },

      modalImage: {
        width: "80%",
        aspectRatio: 1, // păstrează aspectul imaginii
        resizeMode: "contain",
        marginBottom: 16,
        padding: 8,
        height: 200,
        resizeMode: "contain",
        borderRadius: 12,
        alignSelf: "center",
      },

      modalTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#4c1f1f",
        marginTop: 0,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
        //fontFamily: "PlayfairDisplay_700Bold",
        //fontFamily: "EBGaramond-Regular",
        //fontFamily:"Spectral_300Light_Italic",
        fontFamily:"DancingScript_400Regular",
      },

      modalDescription: {
        fontSize: 17,
        color: "#4c1f1f",
        marginTop: 18,
        textAlign: "justify",
        lineHeight: 22,
        paddingHorizontal: 5,
        //fontFamily: "PlayfairDisplay_400Regular",
        //fontFamily: "Spectral_300Light",
        fontFamily:"Spectral_300Light_Italic",
      },

      closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 0,
      },

      modalScrollContent: {
        paddingBottom: 30, // Spațiu la sfârșitul conținutului scrollabil
        //alignItems: "center", // Centrează conținutul în scroll view
        //flexGrow: 1, // Permite scroll view-ului să ocupe tot spațiul disponibil
        //width   : "100%", // Asigură că scroll view-ul ocupă întreaga lățime
        //alignItems: "center", // Centrează conținutul în scroll view
        paddingTop: 40, // Spațiu de sus pentru conținutul scrollabil

      },

      modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
      },

      modalTouchableArea: {
        width: "100%",
        alignItems: "center",
      },
      modalContent: {
        backgroundColor: "#f5e9d6",
        borderRadius: 16,
        width: "90%",
        maxHeight: screenHeight * 0.8,
        padding: 20,
        borderWidth: 1.5,
        borderColor: "#4c1f1f",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 8,
      },



  });


