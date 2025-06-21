import Home from './src/home';
import CameraApp from './src/camera';
import Galerie from './src/galerie';
import Descopera from './src/descopera';
import Preview from './src/preview';
import Result from './src/result';
import Splash  from './src/splashscreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import {Lora_700Bold } from '@expo-google-fonts/lora';
import { CormorantGaramond_400Regular, CormorantGaramond_700Bold, CormorantGaramond_300Light_Italic, CormorantGaramond_400Regular_Italic, CormorantGaramond_500Medium_Italic, CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond';
import {Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import {DancingScript_400Regular } from '@expo-google-fonts/dancing-script';
import { Spectral_400Regular, Spectral_200ExtraLight, Spectral_300Light, Spectral_300Light_Italic } from '@expo-google-fonts/spectral';
import * as Font from 'expo-font';

import { Merriweather_400Regular, Merriweather_700Bold, Merriweather_300Light} from '@expo-google-fonts/merriweather';
import {CrimsonText_400Regular, CrimsonText_700Bold} from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import React, { useEffect, useState } from 'react';
import { Asset } from "expo-asset";


const Stack = createNativeStackNavigator();

Asset.loadAsync([require("./assets/final_decupat.png")])

export default function App() {

  const [customFontsLoaded, setCustomFontsLoaded] = useState(false);

  let [expoFontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular,
    Lora_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_500Medium,
    Lato_400Regular,
    Lato_700Bold,
    DancingScript_400Regular,
    Spectral_400Regular,
    Spectral_200ExtraLight,
    Spectral_300Light,
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_300Light,
    CrimsonText_400Regular,
    CrimsonText_700Bold,
    Spectral_300Light_Italic,
  });
  

    useEffect(() => {
    async function loadCustomFonts() {
      await Font.loadAsync({
        'EBGaramond-Regular': require('./assets/fonturi/EB_Garamond/static/EBGaramond-Regular.ttf'),
      });
      setCustomFontsLoaded(true);
    }

    loadCustomFonts();
  }, []);

  if (!expoFontsLoaded || !customFontsLoaded) return null;

  //return <CameraApp />;
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="SplashScreen">


      <Stack.Screen
          name="SplashScreen"
          component={Splash}
          options={{headerShown:false}}
      />

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
          name="Descopera"
          component={Descopera}
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
