import CameraApp from './src/camera';
import Preview from './src/preview';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  //return <CameraApp />;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoutName='Camera'>
        <Stack.Screen name="Camera" component={CameraApp}/>
        <Stack.Screen name="Preview" component={Preview}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}
