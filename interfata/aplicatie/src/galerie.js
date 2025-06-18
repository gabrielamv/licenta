import React, { useRef, useState, useEffect} from "react";
import {
View,
Text,
StyleSheet,
Image,
FlatList,
TouchableOpacity,
Dimensions,
LayoutAnimation,
Platform,
UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ArrowBendUpLeft, X, DownloadSimple, Trash } from "phosphor-react-native";
import Constants from 'expo-constants';


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const aspectRatio = screenHeight / screenWidth;



export default function Galerie({navigation}) {
    const [images, setImages] = useState([]);
    //const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
      };
    const fetchImages = async () => {
        const storedImages = await AsyncStorage.getItem("restaurari");
        
        let parsed = storedImages ? JSON.parse(storedImages) : [];
        
        parsed = parsed.filter((item) => typeof item === 'object')
        .filter((item) => typeof item.uri === 'string')
        .filter((val, idx, arr) => {return arr.findIndex(el => el.uri == val.uri) === idx;})
        .sort((a, b) => {a.savedAt < b.savedAt ? 1 : -1})
        setImages(parsed);
    };
    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);
      

    const renderItem = ({ item }) => {
        if (!item || !item.uri) return null;

    return (   
    <View style={{ position: "relative" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Result", { restoredImage: item.uri, fromGallery: true, models: item.models, simboluri })}>
            <Image source={{ uri: item.uri }} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => deleteImage(item.uri)}
            style={{
            position: "absolute",
             top: 10,
            right: 10,
            padding: 5,
            borderRadius: 20,
        }}
        >
        {/* <Ionicons name="trash" size={30} color="#8B1E3F" /> */}
        <Trash size={30} color="#8B1E3F" weight="bold" />

        </TouchableOpacity>
    </View>
    )
};

    //cod adaugat pe 14 iunie
    const deleteImage = async (uriToDelete) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const storedImages = await AsyncStorage.getItem("restaurari");
        let parsed = storedImages ? JSON.parse(storedImages) : [];
      
        const filtered = parsed.filter(item => item.uri !== uriToDelete);
        await AsyncStorage.setItem("restaurari", JSON.stringify(filtered));
        // setImages(filtered); // update state pentru a reflecta modificarea
        fetchImages();
      };

    //------------
      

    return (
        <View style={styles.container}>
            {/*HEADER*/} 
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galerie</Text>
            </View>

            <View style={styles.headerSeparator}/>

                <FlatList
                    data={images}
                    //keyExtractor={(item, index) => `${item}-${index}`}
                    keyExtractor={(item, index) => `${item.uri}-${index}`}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={{padding: 8}}
            />

            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowBendUpLeft size={30} color="#4c1f1f" weight="light" />
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

