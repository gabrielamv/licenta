import React, { useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

const Splash = ({ navigation }) => {
  console.log("am intrat pe splash")
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("ma duc acasa")
      navigation.navigate("Home");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/final_decupat.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBEDD5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: height * 0.7, // 50% din înălțime
    aspectRatio: 1,       // păstrează forma pătrată
  },
});

export default Splash;
