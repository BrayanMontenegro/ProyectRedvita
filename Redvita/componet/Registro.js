// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Importar configuración de Firebase
import { collection, addDoc } from 'firebase/firestore'; 
import {getAuth} from 'firebase/auth'; // Importa métodos Firestore
import { initializeApp } from '@firebase/app';

export default function App() {
  const [userData, setUserData] = useState({
    fotoPerfil: '',
    nombreUno: '',
    nombreDos: '',
    apellidoUno: '',
    apellidoDos: '',
    nombreUsuario: '',
    correoElectronico: ''
  });

  const [credentials, setCredentials] = useState({
    numeroCedula: '',
    comunidad: '',
    municipio: '',
    departamento: '',
    edad: '',
    genero: '',
    fechaNacimiento: ''
  });



  const [modalVisible, setModalVisible] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleCredentialsChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
  };

  // Función para guardar datos en Firebase
  const saveCredentials = async () => {
    try {
      // Validar que los campos estén llenos
      if (!userData.nombreUno || !userData.apellidoUno || !userData.nombreUsuario || !userData.correoElectronico) {
        Alert.alert('Error', 'Todos los campos son obligatorios.');
        return;
      }

      // Subir datos a Firebase Firestore
      await addDoc(collection(db, 'usuarios'), {
        ...userData,
        ...credentials
      });

      Alert.alert('Registro Exitoso', 'Los datos han sido guardados exitosamente en Firebase.');
      setModalVisible(false);
      setShowCredentials(true);
    } catch (e) {
      console.error('Error al guardar en Firestore: ', e);
      Alert.alert('Error', 'Hubo un problema al guardar los datos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* Aquí puedes enrutar tu logo */}
        <Image source={{ uri: 'https://example.com/logo.png' }} style={styles.logo} />
      </View>

      {/* Título */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Registro de Usuario</Text>
      </View>

      {/* Formulario de Registro de Usuario */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Foto Perfil (URL):</Text>
        <TextInput
          style={styles.input}
          placeholder="URL de la foto"
          onChangeText={(value) => handleInputChange('fotoPerfil', value)}
          value={userData.fotoPerfil}
        />

        {/* Nombres */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Nombre Uno:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Uno"
              onChangeText={(value) => handleInputChange('nombreUno', value)}
              value={userData.nombreUno}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Nombre Dos:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Dos"
              onChangeText={(value) => handleInputChange('nombreDos', value)}
              value={userData.nombreDos}
            />
          </View>
        </View>

        {/* Apellidos */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Apellido Uno:</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido Uno"
              onChangeText={(value) => handleInputChange('apellidoUno', value)}
              value={userData.apellidoUno}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Apellido Dos:</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido Dos"
              onChangeText={(value) => handleInputChange('apellidoDos', value)}
              value={userData.apellidoDos}
            />
          </View>
        </View>

        {/* Nombre de Usuario y Correo */}
        <Text style={styles.label}>Nombre de Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          onChangeText={(value) => handleInputChange('nombreUsuario', value)}
          value={userData.nombreUsuario}
        />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          onChangeText={(value) => handleInputChange('correoElectronico', value)}
          value={userData.correoElectronico}
        />

        {/* Botón para abrir el modal de credenciales */}
        <Button title="Registrar Credenciales" color="#00ABB3" onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal para Credenciales */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Credenciales</Text>

            <TextInput
              style={styles.input}
              placeholder="Número de Cédula"
              onChangeText={(value) => handleCredentialsChange('numeroCedula', value)}
              value={credentials.numeroCedula}
            />

            <TextInput
              style={styles.input}
              placeholder="Comunidad"
              onChangeText={(value) => handleCredentialsChange('comunidad', value)}
              value={credentials.comunidad}
            />

            <TextInput
              style={styles.input}
              placeholder="Municipio"
              onChangeText={(value) => handleCredentialsChange('municipio', value)}
              value={credentials.municipio}
            />

            <TextInput
              style={styles.input}
              placeholder="Departamento"
              onChangeText={(value) => handleCredentialsChange('departamento', value)}
              value={credentials.departamento}
            />

            <TextInput
              style={styles.input}
              placeholder="Edad"
              keyboardType="numeric"
              onChangeText={(value) => handleCredentialsChange('edad', value)}
              value={credentials.edad}
            />

            <TextInput
              style={styles.input}
              placeholder="Género"
              onChangeText={(value) => handleCredentialsChange('genero', value)}
              value={credentials.genero}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
              onChangeText={(value) => handleCredentialsChange('fechaNacimiento', value)}
              value={credentials.fechaNacimiento}
            />

            <Button title="Guardar" color="#EB1E26" onPress={saveCredentials} />
          </View>
        </View>
      </Modal>

      {/* Mostrar credenciales si están disponibles */}
      {showCredentials && (
        <View style={styles.credentialsContainer}>
          <Text style={styles.credentialsTitle}>Credenciales Registradas:</Text>
          <Text>Número de Cédula: {credentials.numeroCedula}</Text>
          <Text>Comunidad: {credentials.comunidad}</Text>
          <Text>Municipio: {credentials.municipio}</Text>
          <Text>Departamento: {credentials.departamento}</Text>
          <Text>Edad: {credentials.edad}</Text>
          <Text>Género: {credentials.genero}</Text>
          <Text>Fecha de Nacimiento: {credentials.fechaNacimiento}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 100,
    height: 100
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB1E26'
  },
  formContainer: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInputContainer: {
    width: '48%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#00ABB3',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ABB3',
    marginBottom: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EB1E26',
    marginBottom: 15
  },
  credentialsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 5
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ABB3',
    marginBottom: 10
  }
});
