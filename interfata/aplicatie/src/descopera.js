import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";



const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;

export default function Descopera ({route}) {

    const { simboluri } = route.params;
    const navigation = useNavigation();
    const [selectedSimbol, setSelectedSimbol] = useState(null);
    //const [simboluri, setSimboluri] = useState([]);


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
    // <View style={{ position: "relative" }}>
    //     <TouchableOpacity onPress={() => navigation.navigate("Result", { restoredImage: item.uri, fromGallery: true })}>
    //         <Image source={{ uri: item.uri }} style={styles.image} />
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //         onPress={() => deleteImage(item.uri)}
    //         style={{
    //         position: "absolute",
    //          top: 10,
    //         right: 10,
    //         padding: 5,
    //         borderRadius: 20,
    //     }}
    //     >
    //     <Ionicons name="trash" size={30} color="#8B1E3F" />
    //     </TouchableOpacity>
    // </View>
        <TouchableOpacity
            onPress={() => setSimbolSelectat(item)}
            style={{ flex: 1, margin: 8 }}
        >
            <Image
            source={{ uri: item.uri }}
            style={{
                width: screenWidth / 2 - 16,
                height: 200,
                borderRadius: 10,
            }}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>{item.nume}</Text>

        </TouchableOpacity>

    );
};


const renderDetaliiSimbol = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#f5e9d6", padding: 20 }}>
        <TouchableOpacity onPress={handleBack} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={30} color="#4c1f1f" />
        </TouchableOpacity>

        <Image
          source={{ uri: simbolSelectat.uri }}
          style={{ width: "100%", height: 300, borderRadius: 12 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
          {simbolSelectat.nume}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}>
          {simbolSelectat.descriere}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {simbolSelectat ? (
        renderDetaliiSimbol()
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Simboluri</Text>
          </View>
          <View style={styles.separator} />

          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#4c1f1f" />
          </TouchableOpacity>

          <FlatList
            data={simboluri}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ padding: 8 }}
          />
        </>
      )}
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
  });


//     return (

//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <Text style={styles.title}>Simboluri</Text>
//             </View>
//             <View style={styles.separator}/>

//             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//                 <Ionicons name="arrow-back" size={30} color="#4c1f1f" />
//             </TouchableOpacity>

//             <View style={styles.headerSeparator}/>

//                 <FlatList
//                     data={simboluri}
//                     //keyExtractor={(item, index) => `${item}-${index}`}
//                     keyExtractor={(item, index) => `${item.uri}-${index}`}
//                     renderItem={renderItem}
//                     numColumns={2}
//                     contentContainerStyle={{padding: 8}}
//                 />


//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#f5e9d6",
//     },

//     header:{
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 24,
//         paddingVertical: 14,
//         marginTop: aspectRatio > 1.8 ? 25 : 10,
//     },

//     title: {
//         fontFamily: "PlayfairDisplay_700Bold",
//         fontSize: 28,
//         fontWeight: "bold",
//         color: "#4c1f1f",
//         textAlign: "center",
//     },

//     separator:{
//         alignSelf: "center",
//         width: "90%",
//         borderBottomWidth: 2,
//         borderBottomColor: "#d8c7b0",
//         marginBottom: 12,
//     },

//     backButton: {
//         position: "absolute",
//         top: 25,
//         left: 10,
//         zIndex: 10,
//         padding: 10,
//       },

// })
