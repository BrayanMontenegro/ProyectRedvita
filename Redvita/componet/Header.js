import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      {/* Imagen de Perfil */}
      <Image source={require=('./assets/yu.jpg')} style={styles.profileImage} />

      {/* Información del Usuario */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Donald Arguello Lopez Obando</Text>
        <Text style={styles.userLocation}>CMCD Rosa Cerda, KM 97 Carretera al Rama, Boaco</Text>
        <Text style={styles.userContact}>365 - 2309 - 1200A</Text>
      </View>

      {/* Tipo de Sangre */}
      <View style={styles.bloodType}>
        <Text style={styles.bloodTypeText}>A+</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinea elementos horizontalmente con espacio entre ellos
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff', // Puedes ajustar el color de fondo
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Línea inferior opcional
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1, // Ocupa el espacio restante
    paddingHorizontal: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: 12,
    color: '#777',
  },
  userContact: {
    fontSize: 12,
    color: '#777',
  },
  bloodType: {
    backgroundColor: '#FF6F6F', // Color de fondo del tipo de sangre
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  bloodTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
