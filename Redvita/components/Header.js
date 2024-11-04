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
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


// Función para obtener el ícono del tipo de sangre
const getBloodTypeIcon = (bloodType) => {
  const bloodTypeMap = {
    'A+': require('../IconTipoSangre/a+.jpg'),
    'A-': require('../IconTipoSangre/a-.jpg'),
    'B+': require('../IconTipoSangre/b+.jpg'),
    'B-': require('../IconTipoSangre/b-.jpg'),
    'AB+': require('../IconTipoSangre/ab+.jpg'),
    'AB-': require('../IconTipoSangre/ab-.jpg'),
    'O+': require('../IconTipoSangre/o+.jpg'),
    'O-': require('../IconTipoSangre/o-.jpg'),
    'default': require('../IconTipoSangre/default.png'), // Ícono por defecto
  };

  return bloodTypeMap[bloodType] || bloodTypeMap['default'];
};

const Header = () => {
  const navigation = useNavigation();
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
        colors={['#C70039', '#C70039']} // Gradiente de rojo
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: fotoPerfilUrl || defaultProfileUrl }}
              style={styles.profileImage}
            />
            <Image
              source={getBloodTypeIcon(userData.tipoSangre)}
              style={styles.bloodTypeIcon}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userData.nombres} {userData.apellidos}
            </Text>
            <Text style={styles.userEmail}>{userData.correoElectronico}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}
           onPress={() => navigation.navigate('notify')}>
            <Ionicons  name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  gradient: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
  },
  bloodTypeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userEmail: {
    fontSize: 14,
    color: "#ffffff",
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
});

export default Header;
