import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';
import Footer from './Footer';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();

  const images = [
    require('../icons/Modulos/1.png'),
    require('../icons/Modulos/2.png'),
    require('../icons/Modulos/3.png'),
    require('../icons/Modulos/4.png'),
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.emergencyContainer}>
        <Text style={styles.redvitaTitle} >Conoce mas de nosotros</Text>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={styles.carouselImage}
                />
              ))}
            </ScrollView>
      </View>


          <View style={styles.redvitaContainer}>
            <View style={styles.redvitaInfo}>
              <Image source={require('../assets/yu.jpg')} style={styles.redvitaIcon} />
              <View style={styles.redvitaTextContainer}>
                <Text style={styles.redvitaTitle}>Redvita</Text>
                <Text style={styles.redvitaSubtitle}>Soy Yu asistente de redvita</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.redvitaButton} 
               onPress={() => navigation.navigate('Chat')}>
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
    marginTop:5,
  },
  safeArea: {
    flex: 1,
  },
  Lebel:{
    fontSize:18,
    color:"#005e72"
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  carouselContent: {

  alignItems: 'center',
  justifyContent: 'center',
},
carouselImage: {
  width: 300,
  height: 300,
  borderRadius: 10,
  marginHorizontal: 10,
  resizeMode: 'cover',
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 30,
  },
  viewButton: {
    backgroundColor: '#28a745',
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
    backgroundColor: '#dc3545',
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
});

export default HomeScreen;
