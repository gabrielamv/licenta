import React, { useState } from 'react';
import {Ionicons} from '@expo/vector-icons';
import {View, Image, StyleSheet, Text, TouchableOpacity, StatusBar, Platform, FlatList, Animated} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const aiModels = [
    {id: '1', name: 'Model 1'},
    {id: '2', name: 'Model 2'},
    {id: '3', name: 'Model 3'},
    {id: '4', name: 'Model 4'},
];


const Preview = ({route}) => {
    const {photoUri, serverImage} = route.params;
    const navigation = useNavigation();
    const [selectedModel, setSelectedModel] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownHeight = useState(new Animated.Value(0))[0];

    //cod pentru DropDown
    const toggleDropdown = () => {
        if(showDropdown){
            Animated.timing(dropdownHeight, {
                toValue: 0 ,
                duration: 300, 
                useNativeDriver: false,
            }).start(() => setShowDropdown(false));
        }else{
            setShowDropdown(true);
            Animated.timing(dropdownHeight, {
                toValue: 60,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    //----------------------------

    const handleBack = () => {
        navigation.goBack();
    }

    const handleModelSelect = (modelId) => {
        setSelectedModel(modelId);
        console.log(`Model AI selectat: ${modelId}`);
    }

    const renderModelItem = ({item}) => (
        <TouchableOpacity
            style={[
                styles.modelItem,
                selectedModel === item.id && styles.selectedModelItem,
            ]}

            onPress={() => handleModelSelect(item.id)}>

            <Text style = {styles.modelText}>{item.name}</Text>
            </TouchableOpacity>
    );

    return (

            <View style={styles.container}>

                <StatusBar hidden={true}/>


                {/*cod pentru butonul X */}
                <TouchableOpacity onPress={handleBack} style={styles.cancelButton}>
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>

                {/*cod pentru afișarea imaginii făcute */}
                <Text style={styles.text}>Preview:</Text>
                <Image source = {{uri:photoUri}} style={styles.image}/>

                {/*Buton pentru a deschide/inchide drop-down-ul*/}

                <View style={styles.dropdownToggleContainer}>
                    <View style={styles.dropdownRow}>

                        <TouchableOpacity 
                            onPress={toggleDropdown} 
                            style={styles.dropdownToggleButton}>

                            <Text style={styles.dropdownToggleText}>
                                {selectedModel ? `Model: ${aiModels.find(m => m.id === selectedModel)?.name}` : 'Alege modelul AI'}
                            </Text>
                            <Ionicons
                                name={showDropdown ? 'chevron-down':'chevron-up'}
                                size={20}
                                color="white"     
                            />
                        </TouchableOpacity>

                        {/* Buton dreapta ecran */}

                        <TouchableOpacity 
                            style={styles.applyButton} 
                            onPress={() => {
                                const serverRestoredImage = 'data:image/jpg;base64,';
                                navigation.navigate('Result', {restoredImage: serverRestoredImage});

                            }}>

                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color="white" />
                        </TouchableOpacity>
                    </View>

                    {/*---------------------------------- */}

                    {/*Drop-down*/}
                    <Animated.View style = {[styles.dropdownListContainer, {height: dropdownHeight}]}>
                        {showDropdown && (
                            <FlatList
                                data={aiModels}
                                renderItem={renderModelItem}
                                keyExtractor={(item)=> item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.modelList}
                            />
                        )}
                    </Animated.View>
                </View>
            </View>
    );
};

const styles =StyleSheet.create({

    cancelButton: {
        position: 'absolute',
        //top: 20,
        top: Platform.OS === 'ios' ? 50:20,
        left: 10,
        backgroundColor: 'transparent',
        padding: 10,
        zIndex: 1, // asigură-te că e deasupra
      },

    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        position: 'relative', 
        backgroundColor: 'black',
    },

    text: {
        fontSize: 20,
        marginBottom: 20,
    },

    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        //resizeMode: 'contain',
        resizeMode: 'cover',
    },

    dropdownToggleContainer: {
        position: 'absolute',
        bottom: 30,
        left: 10,
        right: 10,
        zIndex: 10,
        elevation: 10,
    },

    
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    
 
    dropdownToggleButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        //padding: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 25,
        //flexDirection: 'row',
        //alignItems: 'center',
        //justifyContent: 'space-between',
        marginRight: 10,
    },

    dropdownToggleText: {
        color: 'white',
        fontSize: 16,
    },

    dropdownListContainer: {
        overflow: 'hidden',
        marginTop: 5,
    },

    applyButton: {
        backgroundColor: 'rgba(0, 150, 255, 0.6)',
        padding: 8,
        borderRadius: 25,
    },

    /*
    modelListContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 10,
        elevation: 10,
    }, */

    modelList: {
        paddingHorizontal: 10,
    },

    modelItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20, 
        marginHorizontal: 5,
    },

    selectedModelItem: {
        backgroundColor: 'rgba(0, 150, 255, 0.6)',
    },

    modelText: {
        color: 'white',
        fontSize: 14,
    },
});

export default Preview;

