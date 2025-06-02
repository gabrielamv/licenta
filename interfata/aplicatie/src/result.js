import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute} from '@react-navigation/native';

const Result = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {restoredImage} = route.params;

    const handleBack = () => {
        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons
                    name ="arrow-back"
                    size = {30}
                    color = "black"
                />
            </TouchableOpacity>


            {/*Titlu? */}
            <Text style={styles.title}> Imaginea restaurată </Text>
            {restoredImage ? (
                //imaginea restaurata primita de la server
                <Image source = {{uri: restoredImage}} style={styles.image} />
                ) 
                : (
                    <Text>Nu am primit imaginea restaurata!</Text>
                )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: Platform.OS === 'ios' ? 50:20,
    },

    title: {
        //color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        //marginVertical: 20,
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 8,
    },

});

export default Result;

