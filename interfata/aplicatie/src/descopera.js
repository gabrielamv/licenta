import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";



const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;

export default function Descopera ({route}) {

    //const { simboluri } = route.params;
    const navigation = useNavigation();
    const [simbolSelectat, setSimbolSelectat] = useState(null);
    //const [simboluri, setSimboluri] = useState([]);
    //const { simboluri = [] } = route.params || {};
    const simboluri = (route.params?.simboluri?.simboluri) || [];
    console.log("PARAMS PRIMITE:", route.params);

    
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

        <TouchableOpacity
            onPress={() => setSimbolSelectat(item)}
            style={styles.symbolWrapper}
        >

        <View style={styles.symbolBackround}>
            <Image
            source={{ uri: item.uri }}
            style={styles.symbolImage}
            />
            </View>
            <Text style={styles.symbolText}>{item.nume}</Text>
        </TouchableOpacity>

    );
};


//     const renderDetaliiSimbol = () => {
//     return (
//       <View style={{ flex: 1, backgroundColor: "#f5e9d6", padding: 20, position: "absolute"}}>
   

//         <TouchableOpacity onPress={handleBack} style={{ marginBottom: 20 }}>
//           <Ionicons name="arrow-back" size={30} color="#4c1f1f" />
//         </TouchableOpacity>
        

//         <Image
//           source={{ uri: simbolSelectat.uri }}
//           style={{ width: "100%", height: 300, borderRadius: 12 }}
//         />

//         <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
//           {simbolSelectat.nume}
//         </Text>

//         <Text style={{ fontSize: 16, marginTop: 10 }}>
//           {simbolSelectat.descriere}
//         </Text>
//       </View>
//     );
// };

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

  {/* MODAL — detalii simbol */}
  <Modal
    visible={!!simbolSelectat}
    transparent
    animationType="fade"
    onRequestClose={() => setSimbolSelectat(null)}
  >
    <Pressable style={styles.modalOverlay} onPress={() => setSimbolSelectat(null)}>
      <View style={styles.modalContent} onPress={() => {}}>
        <TouchableOpacity
          onPress={() => setSimbolSelectat(null)}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#4c1f1f" />
        </TouchableOpacity>

        <Image source={{ uri: simbolSelectat?.uri }} style={styles.modalImage} />
        <Text style={styles.modalTitle}>{simbolSelectat?.nume}</Text>


        <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.modalScrollContent}>

              {simbolSelectat?.semnificatie && (
                <Text style={styles.modalDescription}>
                  Semnificație: {simbolSelectat.semnificatie}
                </Text>
              )}

              {simbolSelectat?.descriere && (
                <Text style={styles.modalDescription}>
                  Descriere: {simbolSelectat.descriere}
                </Text>
              )}

              {simbolSelectat?.regiuni && (
                <Text style={styles.modalDescription}>
                  Regiuni:{simbolSelectat.regiuni}
                </Text>
              )}
            </ScrollView>

        {/* <Text style={styles.modalDescription}>{simbolSelectat?.descriere}</Text> */}
      </View>
    </Pressable>
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
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
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
        marginTop: 10,
        // fontFamily: "Lato_400Regular",
        fontFamily: "PlayfairDisplay_400Regular",
        fontSize: 16,
        color: "#4c1f1f",
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
        maxHeight: "80%",
        //alignItems: "center",
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
      },

      modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4c1f1f",
        marginTop: 0,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "PlayfairDisplay_700Bold",
      },

      modalDescription: {
        fontSize: 16,
        color: "#4c1f1f",
        marginTop: 10,
        textAlign: "justify",
        lineHeight: 22,
        paddingHorizontal: 5,
        fontFamily: "PlayfairDisplay_400Regular",
      },

      closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 8,
      },

      modalScrollContent: {
        paddingBottom: 30, // Spațiu la sfârșitul conținutului scrollabil
        //alignItems: "center", // Centrează conținutul în scroll view
        //flexGrow: 1, // Permite scroll view-ului să ocupe tot spațiul disponibil
        //width   : "100%", // Asigură că scroll view-ul ocupă întreaga lățime
        alignItems: "center", // Centrează conținutul în scroll view
        paddingTop: 10, // Spațiu de sus pentru conținutul scrollabil

      },

  });


