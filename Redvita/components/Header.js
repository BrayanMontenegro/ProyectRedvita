import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

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
          No se pudieron cargar los datos del usuario
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Imagen de Perfil */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: fotoPerfilUrl || defaultProfileUrl }}
            style={styles.profileImage}
          />
          {/* Tipo de Sangre */}
          <View style={styles.bloodType}>
            <Text style={styles.bloodTypeText}>{userData.tipoSangre}</Text>
          </View>
        </View>

        {/* Información del Usuario */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userData.nombres} {userData.apellidos}
          </Text>
          <Text style={styles.userEmail}>{userData.correoElectronico}</Text>
          <Text style={styles.userCedula}>Cédula: {userData.numeroCedula}</Text>
          <Text style={styles.userLocation}>{userData.departamento}</Text>
        </View>

        {/* Botón de Edición */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 5, // Sombra
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff", // Borde blanco para destacar la imagen
  },
  bloodType: {
    backgroundColor: "#ffffff", // Fondo blanco para el tipo de sangre
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  bloodTypeText: {
    color: "#FF6F6F", // Texto rojo para el tipo de sangre
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Texto oscuro para que resalte
  },
  userEmail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  userCedula: {
    fontSize: 12,
    color: "#333",
  },
  userLocation: {
    fontSize: 12,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#FF6F6F",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
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
