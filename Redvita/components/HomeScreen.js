import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header'; // Importing your external Header component
import Footer from './Footer'; // Importing your external Footer component

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Integrating the Header component at the top */}
        <Header />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                <Text style={styles.redvitaSubtitle}>Te invita a compartir</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.redvitaButton}>
              <Text style={styles.redvitaButtonText}>IR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer />
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
    backgroundColor: '#007bff', // Azul brillante para mayor visibilidad
    padding: 10,
    borderRadius: 30,
  },
  viewButton: {
    backgroundColor: '#28a745', // Verde vibrante para el botón de acción
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
    backgroundColor: '#dc3545', // Rojo intenso para emergencias
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
    backgroundColor: '#17a2b8', // Azul turquesa para un toque fresco
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
});

export default HomeScreen;
