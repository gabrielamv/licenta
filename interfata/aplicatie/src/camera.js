import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';


export default function CameraApp() {
  const [cameraType, setCameraType] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

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
        if (mediaPermission?.granted) {
          await MediaLibrary.createAssetAsync(photo.uri);
          const form = new FormData();
          form.append('image', {
            uri: photo.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });
          const response = await fetch('http://192.168.0.107/upload/', {
            method: 'POST',
            body: form
          });
          if(!response.ok){
            Alert.alert("Eroare", "Eroare la trimiterea la server");
          }
          const result = await response.json();
          console.log(result);
          //faci serverul sa raspunda cu ceva si afisezi raspunsul
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
      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.text}>Preview:</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
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
    color: 'white',
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
});