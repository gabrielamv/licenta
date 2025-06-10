import Home from './src/home';
import CameraApp from './src/camera';
import Galerie from './src/galerie';
import Preview from './src/preview';
import Result from './src/result';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import {Lora_700Bold } from '@expo-google-fonts/lora';
import {CormorantGaramond_400Regular, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import {Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from 'react';

const Stack = createNativeStackNavigator();


SplashScreen.preventAutoHideAsync();

export default function App() {

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Lora_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });
  
  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        // Delay 2 secunde înainte să ascundem splash-ul
        await new Promise(resolve => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  //return <CameraApp />;
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Home">


      <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown:false}}
      />
      
      <Stack.Screen
        name="Galerie"
        component={Galerie}
        options={{headerShown: false}}
      />
      
        <Stack.Screen
          name="Camera"
          component={CameraApp}
          options={{headerShown: false}}
          />

        <Stack.Screen 
          name="Preview" 
          component={Preview}
          options={{headerShown: false}}
          />

          <Stack.Screen
            name="Result"
            component={Result}
            options = {{headerShown: false}}
          />

      </Stack.Navigator>
    </NavigationContainer>
  );
  
}
