import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import {Ionicons} from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function CameraApp() {
  const [cameraType, setCameraType] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [splashscreen, setSplashscreen] = useState(true);
  const cameraRef = useRef(null);
  const navigation = useNavigation();


  if(splashscreen){

    useEffect(() => {
      const timer = setTimeout(() => {
        setSplashscreen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);

    return(
      <View style = {styles.splashContainer}>
        <Image source = {require('../assets/splash.png')} style={styles.logo}/>
      </View>
    );

  };



  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, []);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setCameraType((prevType) => (prevType === 'back' ? 'front' : 'back'));
  };
  
  async function takePicture(){
    if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        setTimeout(()=>setPhotoUri(null), 1000);

        //cod pentru navigarea catre pagina de Preview
        navigation.navigate('Preview', {photoUri: photo.uri});
        //------------------------------------------------------
        
        if (mediaPermission?.granted) {
          await MediaLibrary.createAssetAsync(photo.uri);
          const form = new FormData();
          form.append('image', {
            uri: photo.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });

          // trimite imaginea la server
          console.log("trimitem imaginea");
          // const response = await fetch('http://192.168.0.107/upload/', {
          //const response = await fetch('http://192.168.1.191/upload/', {
          //const response = await fetch('http://192.168.0.100:8080/upload/', {
          const response = await fetch('http://172.20.0.9:8080/upload/', {
              method: 'POST',
              body: form,
          });

          // verifică dacă răspunsul de la server este ok
          if(!response.ok){
            Alert.alert("Eroare", "Eroare la trimiterea la server");
          }
          
          console.log("am primit poza")
          //obține rezultatul răspunsului
          const result = await response.json();
          console.log('Server response: ', Object.keys(result)); //verifica raspunsul de la server, 28 mai 

          const r = {};
          if("eroare" in result){
            r.mesaj = result.eroare;
          }else{
            r.mesaj = result.mesaj;
            r.imagine = result.imagine;
            r.imagine = "data:image/jpg;base64,"+result.imagine;

            //merg la pagina de restaurare
            navigation.navigate('Result', {serverImage: restoredImageUri});
          }
          console.log(r.imagine.substring(0, 100))
          
          setServerResponse(r);
          setTimeout(()=>setServerResponse(null), 5000);
         
        } 
      }
  }


  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef}>
        <TouchableOpacity onPress={takePicture} style={styles.cameraContentOut}>
            <View style={styles.cameraContentIn} />
        </TouchableOpacity>
        {/*
        <Button title="Take picture" onPress={takePicture} />
        <Button title="Toggle Camera" onPress={toggleCameraType} /> */}
      </CameraView>

      {/*afisarea imaginii capturate*/}
      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.text}>Preview:</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}
      
      {/*afisarea raspunsului de la server*/}
      {serverResponse && (
        <View style={styles.previewContainer}>
          <Text style={styles.text}>{serverResponse.mesaj}</Text>
          {serverResponse.imagine && (
            <Image source={{ uri: serverResponse.imagine }} style={styles.previewImage} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  cameraContentOut: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius:40,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: 'white'
  },

  cameraContentIn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white'
  },

  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  previewContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },

  previewImage: {
    width: 200,
    height: 300,
    borderRadius: 8,
  },

  //afisare imagine raspuns server
  displayImage:{
    width: 300,
    height: 300,
    marginTop: 20,
  },

  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  logo: {
    width: 600,
    height: 600,
  },

});
