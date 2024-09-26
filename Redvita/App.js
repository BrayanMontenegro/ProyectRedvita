// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen'; // Ajusta la ruta según tu estructura de archivos
import Registro from './components/Registro'; // Ajusta la ruta según tu estructura de archivos
import HomeScreen from './components/HomeScreen'; // Ajusta la ruta según tu estructura de archivos
import * as Font from 'expo-font'; // Para cargar fuentes
import AppLoading from 'expo-app-loading'; // Para mostrar una pantalla de carga mientras se cargan las fuentes
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

const Stack = createStackNavigator();

const App = () => {
  // Cargar las fuentes usando el hook `useFonts`
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    // Mostrar una pantalla de carga mientras se cargan las fuentes
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
