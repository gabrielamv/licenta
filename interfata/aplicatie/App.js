import Home from './src/home';
import CameraApp from './src/camera';
import Preview from './src/preview';
import Result from './src/result';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import AppLoading from 'expo-app-loading';
const Stack = createNativeStackNavigator();



export default function App() {

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });
  
  if (!fontsLoaded) {
    return <AppLoading />;
  }

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
