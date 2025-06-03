import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoredImage } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };
  console.log("Restored image URI:", restoredImage.substring(0, 50) + "...");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      {/*imagine restaurata afisata */}
        <Image source={{ uri: restoredImage }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  title: {
    //color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    //marginVertical: 20,
  },

  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    //resizeMode: 'contain',
    resizeMode: "cover",
  },

  backButton: {
    position: "absolute",
    top: 5,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
});

export default Result;
