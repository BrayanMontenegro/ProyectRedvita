// App.js
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginScreen"; // Ajusta la ruta según tu estructura de archivos
import Registro from "./components/Registro"; // Ajusta la ruta según tu estructura de archivos
import HomeScreen from "./components/HomeScreen"; // Ajusta la ruta según tu estructura de archivos
import NotificationCenter from "./components/Notificaciones";
import AgendarCitaDonacion from "./components/AgregarCitasScreen";
import HistoryScreen from "./components/HistoryScreen";
import Estadisticas from "./components/Estadistica";
import RedVitaScreen from "./components/ChatScreen";
import HistorialDonaciones from "./components/HistorialDonacion";
import CentrosDonacionMap from "./components/MapaCentros";
import * as Font from "expo-font"; // Para cargar fuentes
import * as SplashScreen from "expo-splash-screen"; // Para controlar la pantalla splash
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { View } from "react-native";

// Evitar que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  // Cargar las fuentes usando el hook `useFonts`
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Carga cualquier recurso necesario aquí (fuentes, datos, etc.)
        if (fontsLoaded) {
          setAppIsReady(true); // Marcar la aplicación como lista cuando las fuentes estén cargadas
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Ocultar la pantalla de splash una vez que la aplicación esté lista
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // No renderizamos nada hasta que la app esté lista
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="estady"
          component={Estadisticas}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="notify"
          component={NotificationCenter}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Citas"
          component={AgendarCitaDonacion} 
          options={{ headerShown: false }} 
         />

        <Stack.Screen 
          name="Centros"
          component={CentrosDonacionMap} 
          options={{ headerShown: false }} 
         />

        <Stack.Screen 
          name="Historial"
          component={HistoryScreen} 
          options={{ headerShown: false }} 
         />

        <Stack.Screen 
          name="Historialdonacion"
          component={HistorialDonaciones} 
          options={{ headerShown: false }} 
         />

        <Stack.Screen
          name="Registro"
          component={Registro}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Chat"
          component={RedVitaScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
     
     
  );
};

export default App;
