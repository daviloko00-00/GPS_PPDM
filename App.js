import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


//importando as telas da aplicação
import HomeScreen from "./src/screens/home";
import PosicaoGPSScreen from "./src/screens/PosicaoGPS";



//valor padrão
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown:false}}
        />
        <Stack.Screen
        name="PosicaoGPSScreen"
        component={PosicaoGPSScreen}
        options={{title: 'Posição do GPS'}}
        />
        
      </Stack.Navigator>
      </NavigationContainer>
  );
}


