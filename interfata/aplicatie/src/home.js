import React, { useRef, useState, useEffect, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
//import { useNavigation } from "@react-navigation/native";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;



export default function Home({navigation}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [simboluri, setSimboluri] = useState([]);

  const carouselRef = useRef(null);
  const lastIndex = useRef(0);

  useEffect(() => {
    const fetchSimboluri = async () => {
      try {
        //const response = await fetch('http://172.18.160.1:80/simboluri');
        const response = await fetch('http://192.168.0.100:80/simboluri');
        const data = await response.json();
        setSimboluri(data);
      } catch (error) {
        console.error('Eroare la fetch simboluri:', error);
      } 
    };

    fetchSimboluri();
  }, []);

  const images = [
    { image: require("../assets/home.jpg"),
      text: "Costumul popular este o carte de identitate a sufletului românesc.",
      //position: 'top'
      textBoxStyle: {top: undefined, bottom: undefined, left: undefined, right:undefined, alignSelf: "center", justifyContent: "center"}
    },

    { image: require("../assets/ie2.jpg"),
      text: "În costumul popular se păstreaza nu numai arta, ci și gândirea unei comunități.",
      //position: 'bottom'
      textBoxStyle: {}
   },

    { image: require("../assets/ie4.jpg"),
      text: "Ia nu e îmbrăcăminte. E identitate.",
      //position: 'top'
      textBoxStyle: {}

    },
    { image: require("../assets/ie3.jpg"),
      text: "Fiecare ie spune o poveste.",
      //position: 'bottom'
      textBoxStyle: {}
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/logo_home.png")} style={styles.logo} />
        <Text style={styles.title}>Povești brodate</Text>
      </View>

      <View style={styles.separator} />

      {/* Main Content */}
      <View style={styles.imageWrapper}>
        <Carousel
          ref={carouselRef}
          width={screenWidth}
          height={screenHeight * 0.5}
          autoPlay
          autoPlayInterval={10000}
          loop
          data={images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.carouselImage} />
          )}
          onProgressChange={(offsetProgress) => {
            let index = Math.round(Math.abs(offsetProgress)/375);
            // index = images.length - 1 - index;
            
            if(index > images.length -1)
                index = 0;
            if(index < 0)
                index = images.length - 1;
            if (index !== lastIndex.current) {
                lastIndex.current = index;
                setActiveIndex(index);
            }
            }}

        />

        {/* <View style={styles.textBox}>
          <Text style={styles.text}>
            "Costumul popular este {"\n"}
            <Text style={styles.italic}>o carte de identitate</Text> {"\n"} a sufletului românesc."
            {"\n"}       Romulus Vulcănescu
          </Text>
        </View> */}

        <View style={[
            styles.textBox,
            images[activeIndex].textBoxStyle
        ]}>
          <Text style={styles.text}>
            { images[activeIndex].text }
          </Text>
        </View>

        {/* Buline de navigare */}
        <View style={styles.dotsWrapper}>
          {images.map((_, i) => (
            <View
                key={i}
                style={[
                    styles.dot,
                    i === activeIndex && styles.activeDot
                ]}
                />
          ))}
        </View>
      </View>

      {/* Butoane */}
      <View style={styles.buttonContainer}>
        <CustomButton icon="camera-outline" text="Scanează" onPress = { () => navigation.navigate("Camera", {simboluri})} />
        <CustomButton icon="images-outline" text="Vezi restaurările tale" onPress = { () => navigation.navigate("Galerie")} />
        <CustomButton icon="search" text="Descoperă simbolurile" onPress = { () => navigation.navigate("Descopera", {simboluri})} /> 
      </View>
    </View>
  );
}

function CustomButton({ icon, text, onPress }) {
  return (
    <Pressable 
    onPress = {onPress}
    style={({ pressed }) => [
      styles.button,
      pressed && { backgroundColor: "#e6c7aa" }
    ]}>
      <Ionicons name={icon} size={28} color="#5a2a2a" style={{ marginRight: 8 }} />
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
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
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 12,
    marginTop: 10,
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
  imageWrapper: {
    width: screenWidth,
    height: screenHeight * 0.5,
    //borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  carouselImage: {
    width: screenWidth,
    height: screenHeight * 0.5,
    resizeMode: "cover",
  },
  textBox: {
    position: "absolute",
    //top: 16,
    alignSelf: "center",
    //left: 60,
    padding: 12,
    backgroundColor: "rgba(245, 233, 214, 0.85)",
    opacity: 0.8,
    borderRadius: 8,
    maxWidth: "80%",
  },
  text: {
    color: "#4c1f1f",
    fontSize: 24,
    lineHeight: 28,
    fontFamily: "CormorantGaramond_400Regular",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowRadius: 2,
  },
  italic: {
    fontStyle: "italic",
    fontFamily: "CormorantGaramond_700Bold",
  },
  dotsWrapper: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    margin: 5,
    backgroundColor: "#d8c7b0",
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: "#4c1f1f",
    opacity: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: aspectRatio > 1.8 ? 20 : 7,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderColor: "#4c1f1f",
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: aspectRatio > 1.8 ? 12 : 8,
    alignItems: "center",
    width: Math.min(screenWidth * 0.68, 300),
  },
  buttonText: {
    fontSize: 20,
    color: "#4c1f1f",
    fontFamily: "Lato_400Regular",
    //fontFamily: "CormorantGaramond_500Medium_Italic",
    //fontFamily: "CormorantGaramond_400Regular",
    fontWeight: "500",
  },
});
