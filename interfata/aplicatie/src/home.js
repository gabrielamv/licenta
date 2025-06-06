import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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

        <View style={styles.textBox}>
          <Text style={styles.text}>
            Cusătura păstrează {"\n"} povestea.{"\n"}
            <Text style={styles.italic}>Restaurarea</Text> {"\n"} o reînvie.
          </Text>
        </View>
      </View>

      {/*cod butoane */}
      <View style={styles.buttonContainer}>
        <CustomButton icon = "camera-outline"  text="Restaurează"/>
        <CustomButton icon = "photo-library" text = "Vezi restaurările tale"/>
        <CustomButton icon = "search" text = "Descoperă simbolurile"/>
      </View>
    </View>
  );
}

function CustomButton({ icon, text }) {
    return (
        <TouchableOpacity style = {styles.button}>
            <Ionicons name = {icon} size = {28} color = {"#4c1f1f"} style = {{marginRight:8}}/>
            <Text style = {styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
};

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
    width:screenWidth,
    height:screenHeight*0.5,
    //width:"100%",
    //margin: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    //height:360,
  },
  image: {
    //flex:1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

//textbox pentru citatul de pe prima poza
  textBox:{
    position: "absolute",
    top: 24,
    left: 16,
    right:16,
    padding: 16,
    backgroundColor: "rgba(255, 233, 214, 0.85)",
    borderRadius:8,
  }, 

  //overlay: {
    //...StyleSheet.absoluteFillObject,
    //backgroundColor: "rgba(245, 233, 214, 0.8)",
    //padding: 24,
    //justifyContent: "flex-start",
  //},
  text: {
    color: "#4c1f1f",
    fontSize: 16,
    lineHeight: 24,
  },
  italic: {
    fontStyle: "italic",
  },

  buttonContainer:{
    width: "100%",
    alignItems: 'center',
    marginTop: 11,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#4c1f1f',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
    width: Math.min(screenWidth*0.68, 300), //"68%",
  },

  buttonText: {
    fontSize: 16,
    color: '#4c1f1f',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '500',
  },
});
