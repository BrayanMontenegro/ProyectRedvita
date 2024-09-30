import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from './Header'; // Importing your external Header component

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Integrating the Header component at the top */}
        <Header />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Notification Section */}
          <View style={styles.notificationContainer}>
            {/* Left Section: Notification Icon and Text */}
            <View style={styles.notificationLeft}>
              <Ionicons name="notifications-outline" size={30} color="#fff" />
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Notificaciones</Text>
                <Text style={styles.notificationSubtitle}>Evento Disponible</Text>
              </View>
            </View>

            {/* Middle Section: Cancel and Accept Buttons */}
            <View style={styles.notificationButtons}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>

            {/* Right Section: Redvita Logo */}
            <View style={styles.notificationLogo}>
              <Image source={require('../assets/icono.png')} style={styles.logo} />
            </View>
          </View>

          {/* Emergency Card */}
          <View style={styles.emergencyContainer}>
            <View style={styles.placeholderIconContainer}>
              <Ionicons name="image-outline" size={80} color="#ccc" />
            </View>
            <View style={styles.emergencyBottomContainer}>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-back-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewText}>VER</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>EMERGENCIA</Text>
              <Ionicons name="alert-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Redvita Button */}
          <View style={styles.redvitaContainer}>
            <View style={styles.redvitaInfo}>
              <Image source={require('../assets/icono.png')} style={styles.redvitaIcon} />
              <View style={styles.redvitaTextContainer}>
                <Text style={styles.redvitaTitle}>Redvita</Text>
                <Text style={styles.redvitaSubtitle}>Te invita a compartir con tus amigos</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.redvitaButton}>
              <Text style={styles.redvitaButtonText}>IR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="home" size={30} color="#fff" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="time-outline" size={30} color="#fff" />
            <Text style={styles.navText}>Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chatbox-outline" size={30} color="#fff" />
            <Text style={styles.navText}>Consultar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="event-available" size={30} color="#fff" />
            <Text style={styles.navText}>Citas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="location-outline" size={30} color="#fff" />
            <Text style={styles.navText}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#005e72',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTextContainer: {
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  notificationButtons: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#005e72',
  },
  cancelButtonText: {
    color: '#005e72',
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#e90101',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationLogo: {
    paddingHorizontal: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  emergencyContainer: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  placeholderIconContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    marginBottom: 10,
  },
  emergencyBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  arrowButton: {
    backgroundColor: '#005e72',
    padding: 10,
    borderRadius: 30,
  },
  viewButton: {
    backgroundColor: '#005e72',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 50,
  },
  viewText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#e90101',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  redvitaContainer: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  redvitaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redvitaIcon: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  redvitaTextContainer: {
    flexDirection: 'column',
  },
  redvitaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005e72',
  },
  redvitaSubtitle: {
    fontSize: 14,
    color: '#005e72',
  },
  redvitaButton: {
    backgroundColor: '#005e72',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redvitaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e90101',
    paddingVertical: 15,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default HomeScreen;
