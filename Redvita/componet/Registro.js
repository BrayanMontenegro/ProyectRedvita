// RegistroUsuario.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Modal,
  Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Dimensions } from 'react-native';
import { db } from '../firebaseConfig'; // Importar configuración de Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importar métodos de Firestore

const { width, height } = Dimensions.get('window');

export default function RegistroUsuario({ navigation }) {
  const [userData, setUserData] = useState({
    nombres: '',
    apellidos: '',
    nombreUsuario: '',
    correoElectronico: '',
    contraseña: '',
    fotoPerfil: null,
  });

  const [credentials, setCredentials] = useState({
    fechaNacimiento: '',
    numeroCedula: '',
    comunidad: '',
    municipio: '',
    departamento: '',
    edad: '',
    genero: '',
  });

  const [inputFocus, setInputFocus] = useState({
    nombres: false,
    apellidos: false,
    nombreUsuario: false,
    correoElectronico: false,
    contraseña: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Siguiente');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Manejo de la selección de imagen
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, fotoPerfil: result.uri });
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleCredentialsChange = (field, value) => {
    if (field === 'numeroCedula') {
      const formattedValue = formatCedula(value);
      setCredentials({ ...credentials, numeroCedula: formattedValue });
    } else {
      setCredentials({ ...credentials, [field]: value });
    }
  };

  const formatCedula = (value) => {
    value = value.replace(/[^0-9A-Za-z]/g, '');

    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 10) {
      value = value.slice(0, 10) + '-' + value.slice(10);
    }

    value = value.slice(0, 16);

    if (value.length === 16 && /[a-zA-Z]$/.test(value)) {
      value = value.slice(0, 15) + value.charAt(15).toUpperCase();
    }

    return value;
  };

  const handleInputFocus = (field) => {
    setInputFocus({ ...inputFocus, [field]: true });
  };

  const handleInputBlur = (field) => {
    setInputFocus({ ...inputFocus, [field]: false });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setCredentials({ ...credentials, fechaNacimiento: currentDate.toISOString().split('T')[0] });
  };

  const validateInputs = () => {
    const { nombres, apellidos, correoElectronico } = userData;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]*$/;
    if (!nameRegex.test(nombres) || !nameRegex.test(apellidos)) {
      Alert.alert('Error', 'Los nombres y apellidos solo deben contener letras.');
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(correoElectronico)) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido.');
      return false;
    }
    return true;
  };

  const validateCredentials = () => {
    const { numeroCedula, edad } = credentials;
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Z]$/;
    if (!cedulaRegex.test(numeroCedula)) {
      Alert.alert('Error', 'El número de cédula debe tener el formato ###-######-##### y terminar en una letra mayúscula.');
      return false;
    }
    if (isNaN(edad) || edad <= 0) {
      Alert.alert('Error', 'La edad debe ser un número positivo.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    // Solo abrir el modal sin validar el número de cédula
    if (validateInputs()) {
      setModalVisible(true);
    }
  };

  const handleSaveCredentials = async () => {
    if (validateCredentials()) {
      // Guardar los datos en Firebase
      try {
        await addDoc(collection(db, 'usuarios'), {
          ...userData,
          ...credentials,
        });

        Alert.alert('Registro Exitoso', 'Los datos han sido guardados en Firebase.');
        setModalVisible(false);
        setButtonText('Finalizar registro');
      } catch (e) {
        console.error('Error al guardar en Firestore: ', e);
        Alert.alert('Error', 'Hubo un problema al guardar los datos.');
      }
    }
  };

  const clearFields = () => {
    // Limpiar todos los campos de entrada
    setUserData({
      nombres: '',
      apellidos: '',
      nombreUsuario: '',
      correoElectronico: '',
      contraseña: '',
      fotoPerfil: null,
    });
    setCredentials({
      fechaNacimiento: '',
      numeroCedula: '',
      comunidad: '',
      municipio: '',
      departamento: '',
      edad: '',
      genero: '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo */}
          <Image
            source={require('../assets/logo_horizontal_con_slogan.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.title}>Registro de usuario</Text>

          {/* Foto de perfil */}
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {userData.fotoPerfil ? (
              <Image source={{ uri: userData.fotoPerfil }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Agregar una foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Campos de Registro */}
          {['nombres', 'apellidos', 'nombreUsuario', 'correoElectronico', 'contraseña'].map((field, index) => (
            <View key={index} style={styles.inputContainer}>
              {inputFocus[field] || userData[field] ? (
                <Text style={styles.inputLabel}>{field === 'nombreUsuario' ? 'Nombre de usuario' : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              ) : null}
              <TextInput
                style={styles.input}
                placeholder={field === 'nombreUsuario' ? 'Ingrese un usuario' : `Ingrese sus ${field}`}
                secureTextEntry={field === 'contraseña' && !showPassword}
                keyboardType={field === 'correoElectronico' ? 'email-address' : 'default'}
                onFocus={() => handleInputFocus(field)}
                onBlur={() => handleInputBlur(field)}
                onChangeText={(value) => handleInputChange(field, value)}
                value={userData[field]}
              />
              {/* Icono para mostrar/ocultar contraseña */}
              {field === 'contraseña' && (
                <TouchableOpacity
                  style={styles.showPasswordIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    source={showPassword ? require('../icons/IconsRegistro/ver.png') : require('../icons/IconsRegistro/ocultar.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
              <Text style={styles.buttonText}>Vaciar Campos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.finishButton} onPress={handleNext}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

          {/* Modal para Credenciales */}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Text style={styles.modalTitle}>Registro de Credenciales</Text>
                  {/* Selector de fecha */}
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text>{credentials.fechaNacimiento ? credentials.fechaNacimiento : 'Seleccionar Fecha de Nacimiento'}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Número de Cédula"
                    onChangeText={(value) => handleCredentialsChange('numeroCedula', value)}
                    value={credentials.numeroCedula}
                    keyboardType="default"
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
                    onChangeText={(value) => handleCredentialsChange('edad', value)}
                    value={credentials.edad}
                    keyboardType="numeric"
                  />
                  {/* Selector de Género */}
                  <Picker
                    selectedValue={credentials.genero}
                    onValueChange={(itemValue) => handleCredentialsChange('genero', itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Seleccione Género" value="" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                  </Picker>
                  <View style={styles.buttonContainer}>
                    <Button title="Guardar" onPress={handleSaveCredentials} color="#00ABB3" />
                    <Button title="Vaciar Campos" onPress={clearFields} color="#EB1E26" />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: width * 0.05,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: (width * 0.8 * 526) / 2226,
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: height * 0.02,
    width: width * 0.6,
    height: height * 0.2,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  inputContainer: {
    marginBottom: height * 0.015,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00ABB3',
    borderRadius: 5,
    padding: height * 0.02,
    fontSize: width * 0.04,
  },
  inputLabel: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    color: '#00ABB3',
    fontSize: width * 0.035,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03,
  },
  clearButton: {
    backgroundColor: '#00ABB3',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: 5,
  },
  finishButton: {
    backgroundColor: '#EB1E26',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EB1E26',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    paddingBottom: height * 0.02,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#00ABB3',
    borderRadius: 5,
    padding: height * 0.02,
    marginBottom: height * 0.015,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 10,
    top: height * 0.02,
  },
  icon: {
    width: 20,
    height: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: height * 0.015,
  },
});
