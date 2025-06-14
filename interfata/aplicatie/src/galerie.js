import React, { useRef, useState, useEffect} from "react";
import {
View,
Text,
StyleSheet,
Image,
FlatList,
TouchableOpacity,
Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;



export default function Galerie({navigation}) {
    const [images, setImages] = useState([]);
    //const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
      };

    useEffect(() => {
        const fetchImages = async () => {
            const storedImages = await AsyncStorage.getItem("restaurari");
            
            let parsed = storedImages ? JSON.parse(storedImages) : [];
            
            parsed = parsed.filter((item) => typeof item === 'object')
            .filter((item) => typeof item.uri === 'string')
            .sort((a, b) => {a.savedAt < b.savedAt ? 1 : -1});
            setImages(parsed);
        };
        fetchImages();
    }, []);

    const renderItem = ({ item }) => {
        
        console.log(item)
        return (
        <TouchableOpacity
            onPress = {() => navigation.navigate("Result", { restoredImage: item.uri, fromGallery: true})}>
            <Image source = {{ uri: item.uri}} style={styles.image}/>
        </TouchableOpacity>
    )};

    return (
        <View style={styles.container}>
            {/*HEADER*/} 
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galerie</Text>
            </View>

            <View style={styles.headerSeparator}/>

                <FlatList
                    data={images}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={{padding: 8}}
            />

            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={30} color="#5a2a2a" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#f5e9d6",
    },

    image: {
        width: Dimensions.get("window").width / 2 - 16,
        height: 200,
        margin: 4,
        borderRadius: 10,
    },

    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 14,
        marginTop: aspectRatio > 1.8 ? 25 : 10,
    },

    headerTitle:{
        fontFamily: "PlayfairDisplay_700Bold",
        fontSize: 28,
        fontWeight: "bold",
        color: "#4c1f1f",
        textAlign: "center",
    },

    headerSeparator:{
        alignSelf: "center",
        width: "90%",
        borderBottomWidth: 2,
        borderBottomColor: "#d8c7b0",
        marginBottom: 12,
    },

    backButton: {
        position: "absolute",
        //resizeMode: "contain",
        top: 20,
        left: 10,
        zIndex: 10,
        padding: 10,
      },
    
});

