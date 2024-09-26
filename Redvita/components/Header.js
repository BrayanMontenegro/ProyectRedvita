import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth'; // Firebase Auth para obtener el usuario actual
import { query, collection, where, getDocs } from 'firebase/firestore'; // Firebase Firestore para leer los datos del usuario usando 'uid'
import { getDownloadURL, ref } from 'firebase/storage'; // Firebase Storage para obtener la foto de perfil
import { db, storage } from '../firebaseConfig'; // Asegúrate de tener esta configuración correcta

const Header = () => {
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null); // Para almacenar la URL de la imagen de perfil

  const defaultProfileUrl = Image.resolveAssetSource(require('../assets/revita.png')).uri;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const q = query(collection(db, 'usuario_donante'), where('uid', '==', user.uid));
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

    fetchUserData();
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
        <Text style={styles.errorText}>No se pudieron cargar los datos del usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {/* Imagen de Perfil */}
      <Image
        source={{ uri: fotoPerfilUrl || defaultProfileUrl }}
        style={styles.profileImage}
      />

      {/* Información del Usuario */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.nombres} {userData.apellidos}</Text>
        <Text style={styles.userCedula}>Cédula: {userData.numeroCedula}</Text>
        <Text style={styles.userLocation}>Departamento: {userData.departamento}</Text>
      </View>

      {/* Tipo de Sangre */}
      <View style={styles.bloodType}>
        <Text style={styles.bloodTypeText}>{userData.tipoSangre}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FF6F6F', // Fondo rojo similar
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userCedula: {
    fontSize: 12,
    color: '#f2f2f2',
  },
  userLocation: {
    fontSize: 12,
    color: '#f2f2f2',
  },
  bloodType: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  bloodTypeText: {
    color: '#FF6F6F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Header;
