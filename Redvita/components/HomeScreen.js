import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Header from './Header';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <ScrollView>
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
      </ScrollView>

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
    backgroundColor: '#f0f0f0', // Color de fondo más suave
  },
  header: {
    paddingTop: 30, // Ajustar el espacio superior para evitar flex innecesario
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    elevation: 3, // Añade sombra para Android
    shadowColor: '#000', // Añade sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  notificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  notificationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  redvitaButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  redvitaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 75, // Imagen en forma circular
  },
  emergencyCard: {
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  emergencyButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  buttonIcon: {
    fontSize: 24,
  },
  redvitaInviteButton: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  redvitaInviteText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  irButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  irText: {
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
