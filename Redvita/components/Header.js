import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from 'react-native-linear-gradient'; // Importar LinearGradient
import { getAuth } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

// Función para obtener el ícono del tipo de sangre
const getBloodTypeIcon = (bloodType) => {
  const bloodTypeMap = {
    'A+': require('../IconTipoSangre/a+.png'),
    'A-': require('../IconTipoSangre/a-.png'),
    'B+': require('../IconTipoSangre/b+.png'),
    'B-': require('../IconTipoSangre/b-.png'),
    'AB+': require('../IconTipoSangre/ab+.png'),
    'AB-': require('../IconTipoSangre/ab-.png'),
    'O+': require('../IconTipoSangre/o+.png'),
    'O-': require('../IconTipoSangre/o-.png'),
    'default': require('../IconTipoSangre/default.png'), // Ícono por defecto
  };

  return bloodTypeMap[bloodType] || bloodTypeMap['default'];
};

const Header = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null);

  const defaultProfileUrl = Image.resolveAssetSource(
    require("../assets/revita.png")
  ).uri;

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const q = query(
            collection(db, "usuario_donante"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            setUserData(data);

            if (data.fotoPerfil) {
              try {
                const fotoRef = ref(storage, data.fotoPerfil);
                const url = await getDownloadURL(fotoRef);
                setFotoPerfilUrl(url);
              } catch (error) {
                setFotoPerfilUrl(defaultProfileUrl);
              }
            } else {
              setFotoPerfilUrl(defaultProfileUrl);
            }
          } else {
            setFotoPerfilUrl(defaultProfileUrl);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F6F" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.header}>
        <Text style={styles.errorText}>
          Error al cargar los datos del usuario
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FF5F6D', '#FFC371']} // Colores del gradiente
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          {/* Contenedor de Imagen de Perfil y Tipo de Sangre */}
          <View style={styles.profileAndBloodTypeContainer}>
            <Image
              source={{ uri: fotoPerfilUrl || defaultProfileUrl }}
              style={styles.profileImage}
            />
            {/* Ícono de tipo de sangre sobre la imagen de perfil */}
            <Image
              source={getBloodTypeIcon(userData.tipoSangre)}
              style={styles.bloodTypeIcon}
            />
          </View>
          {/* Información del Usuario */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userData.nombres} {userData.apellidos}
            </Text>
            <Text style={styles.userEmail}>{userData.correoElectronico}</Text>
          </View>
          {/* Icono de notificaciones */}
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Reducir el espacio vertical para acercar al borde curvo
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff", // Borde blanco para destacar la imagen
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userName: {
    fontSize: 18, // Reducir el tamaño del texto del nombre
    fontWeight: "bold",
    color: "#ffffff", // Texto blanco para contraste
  },
  userEmail: {
    fontSize: 14,
    color: "#ffffff", // Texto blanco para contraste
  },
  bloodTypeIcon: {
    width: 25, // Tamaño ajustado para evitar zoom excesivo
    height: 25, // Mantener la proporción
    position: 'absolute',
    bottom: 2, // Posición ajustada para alineación estética
    right: 2, // Posición ajustada para alineación estética
    borderWidth: 1, // Grosor del borde ajustado para un look más fino
    borderColor: '#fff', // Borde blanco para destacar el ícono
    borderRadius: 100, // Radio del borde para hacerlo completamente circular
    backgroundColor: '#fff', // Fondo blanco para mejorar contraste con el ícono rojo
  },
  notificationButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  profileAndBloodTypeContainer: {
    position: 'relative',
  },
});

export default Header;
