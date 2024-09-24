// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen'; // Ajusta la ruta según tu estructura de archivos
import Registro from './components/Registro'; // Ajusta la ruta según tu estructura de archivos
import HomeScreen from './components/HomeScreen '; // Ajusta la ruta según tu estructura de archivos

const Stack = createStackNavigator();

const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;
