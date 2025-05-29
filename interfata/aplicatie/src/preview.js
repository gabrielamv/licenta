import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {View, Image, StyleSheet, Text, Button} from 'react-native';


const Preview = ({route}) => {
    const {photoUri, serverImage} = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Preview:</Text>
            <Image source = {{uri:photoUri}} style={styles.image}/>
        </View>
    );
};

const styles =StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: '100%',
        marginBottom: 20,
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default Preview;

