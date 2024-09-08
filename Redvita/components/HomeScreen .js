import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Header  from './Header';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Header/>
      </View>
      <View style={styles.notificationsContainer}>
        <Text style={styles.notificationText}>Evento Disponible</Text>
        <View style={styles.notificationButtons}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.redvitaButton}>
          <Text style={styles.redvitaText}>Redvita</Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor de la imagen */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.placeholderImage} />
      </View>

      {/* Contenedor de la tarjeta de emergencia */}
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyText}>EMERGENCIA</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.buttonIcon}>🚨</Text>
        </TouchableOpacity>
      </View>

      {/* Redvita botón */}
      <TouchableOpacity style={styles.redvitaInviteButton}>
        <Text style={styles.redvitaInviteText}>Redvita te invita a compartir con tus amigos</Text>
        <TouchableOpacity style={styles.irButton}>
          <Text style={styles.irText}>IR</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Footer con los botones */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerText}>Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerText}>Consultar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
header:{
flex:1,
marginTop:30,
},

  notificationsContainer: {
    flex:1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  redvitaButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  redvitaText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex:3,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  emergencyCard: {
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 5,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emergencyButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  buttonIcon: {
    fontSize: 24,
  },
  redvitaInviteButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  redvitaInviteText: {
    fontSize: 14,
    color: '#333',
  },
  irButton: {
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  irText: {
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
