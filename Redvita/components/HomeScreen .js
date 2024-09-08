import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './Header';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
     <Header/>
      <View style={styles.header}>
        <Image source={{ uri: 'URL_DE_TU_IMAGEN_DE_PERFIL' }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Donald Arguello Lopez Obando</Text>
          <Text style={styles.userLocation}>CMCD Rosa Cerda, KM 97 Carretera al Rama, Boaco</Text>
          <Text style={styles.userContact}>365 - 2309 - 1200A</Text>
        </View>
        <View style={styles.bloodType}>
          <Text style={styles.bloodTypeText}>A+</Text>
        </View>
      </View>

      {/* Event Notification */}
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationText}>Evento Disponible</Text>
        <View style={styles.notificationButtons}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Section */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyText}>EMERGENCIA</Text>
        <Image source={{ uri: 'URL_DE_TU_ICONO_DE_EMERGENCIA' }} style={styles.emergencyIcon} />
      </View>

      {/* Invite Section */}
      <View style={styles.inviteContainer}>
        <Text style={styles.inviteText}>Redvita</Text>
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.buttonText}>IR</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Image source={{ uri: 'URL_ICONO_INICIO' }} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={{ uri: 'URL_ICONO_HISTORIAL' }} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={{ uri: 'URL_ICONO_CONSULTAR' }} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:30,
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal:111,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
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
    backgroundColor: '#FFAAAA',
    padding: 10,
    borderRadius: 5,
  },
  bloodTypeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContainer: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyContainer: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyIcon: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
  inviteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  inviteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviteButton: {
    backgroundColor: '#00bcd4',
    padding: 10,
    borderRadius: 5,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default HomeScreen;
