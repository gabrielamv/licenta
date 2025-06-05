import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo_home.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.titleWrapper}>
            <Text style={styles.title}>Povești brodate</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="menu" size={36} color="#4c1f1f" />
        </TouchableOpacity>

      </View>

      <View style={styles.separator}/>

      {/* Main Content */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/home.jpeg")}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Text style={styles.text}>
            Cusătura păstrează {"\n"} povestea.{"\n"}
            <Text style={styles.italic}>Restaurarea</Text> {"\n"} o reînvie.
          </Text>
        </View>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    //borderBottomWidth: 2,
    //borderBottomColor: "#d8c7b0",
    position: "relative",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 8,
    marginTop: 10, 
  },

  titleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    fontWeight: "bold",
    color: "#4c1f1f",
    //justifyContent: "center",
    //alignItems: "center",
    //left:0,
    //right:0,
    textAlign: "center",
    //position:'absolute',

  },

  separator:{
    alignSelf: "center",
    width: "90%",
    borderBottomWidth:2,
    borderBottomColor: "#d8c7b0",
    marginBottom:12,
  },

  imageWrapper: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 480,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(245, 233, 214, 0.8)",
    padding: 24,
    justifyContent: "flex-start",
  },
  text: {
    color: "#4c1f1f",
    fontSize: 16,
    lineHeight: 24,
  },
  italic: {
    fontStyle: "italic",
  },
});
