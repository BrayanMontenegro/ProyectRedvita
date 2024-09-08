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
import { auth, db } from '../firebaseConfig'; // Importa configuración de Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importar métodos de Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importar método de autenticación

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

  const [inputFocus, setInputFocus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Siguiente');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Manejo de la selección de imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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
    const formattedValue = field === 'numeroCedula' ? formatCedula(value) : value;
    setCredentials({ ...credentials, [field]: formattedValue });
  };

  const formatCedula = (value) => {
    value = value.replace(/[^0-9A-Za-z]/g, '');

    if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
    if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
    if (value.length === 16 && /[a-zA-Z]$/.test(value)) value = value.slice(0, 15) + value.charAt(15).toUpperCase();
    
    return value.slice(0, 16);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setCredentials({ ...credentials, fechaNacimiento: currentDate.toISOString().split('T')[0] });
  };

  const validateInputs = () => {
    const { nombres, apellidos, correoElectronico, contraseña } = userData;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]*$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!nameRegex.test(nombres) || !nameRegex.test(apellidos)) {
      Alert.alert('Error', 'Los nombres y apellidos solo deben contener letras.');
      return false;
    }

    if (!emailRegex.test(correoElectronico)) {
      Alert.alert('Error', 'Ingrese un correo electrónico válido.');
      return false;
    }

    if (contraseña.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleInputBlur = (field) => {
    setInputFocus({ ...inputFocus, [field]: false });
  };
  
  const handleInputFocus = (field) => {
    setInputFocus({ ...inputFocus, [field]: true });
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
    if (validateInputs()) {
      setModalVisible(true);
    }
  };

  const handleSaveCredentials = async () => {
    if (validateCredentials()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.correoElectronico, userData.contraseña);
        const user = userCredential.user;

        await addDoc(collection(db, 'usuarios'), {
          uid: user.uid,
          ...userData,
          ...credentials,
        });

        Alert.alert('Registro Exitoso', 'Los datos han sido guardados en Firebase.');
        setModalVisible(false);
        setButtonText('Finalizar registro');
      } catch (e) {
        console.error('Error al guardar en Firebase: ', e);

        const errorMessages = {
          'auth/email-already-in-use': 'El correo electrónico ya está en uso.',
          'auth/invalid-email': 'El correo electrónico no es válido.',
          'auth/weak-password': 'La contraseña es muy débil.',
        };

        Alert.alert('Error', errorMessages[e.code] || 'Hubo un problema al guardar los datos.');
      }
    }
  };

  const clearFields = () => {
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('../assets/logo_horizontal_con_slogan.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Registro de usuario</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {userData.fotoPerfil ? (
              <Image source={{ uri: userData.fotoPerfil }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Agregar una foto</Text>
              </View>
            )}
          </TouchableOpacity>

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
              {field === 'contraseña' && (
                <TouchableOpacity style={styles.showPasswordIcon} onPress={() => setShowPassword(!showPassword)}>
                  <Image source={showPassword ? require('../icons/IconsRegistro/ver.png') : require('../icons/IconsRegistro/ocultar.png')} style={styles.icon} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFields} accessibilityLabel="Botón para vaciar campos">
              <Text style={styles.buttonText}>Vaciar Campos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.finishButton} onPress={handleNext} accessibilityLabel="Botón para finalizar registro">
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <Text style={styles.modalTitle}>Registro de Credenciales</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text>{credentials.fechaNacimiento ? credentials.fechaNacimiento : 'Seleccionar Fecha de Nacimiento'}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />
                  )}
                  {['numeroCedula', 'comunidad', 'municipio', 'departamento', 'edad'].map((field) => (
                    <TextInput
                      key={field}
                      style={styles.input}
                      placeholder={`Ingrese su ${field}`}
                      onChangeText={(value) => handleCredentialsChange(field, value)}
                      value={credentials[field]}
                      keyboardType={field === 'edad' ? 'numeric' : 'default'}
                    />
                  ))}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaa',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 14,
    color: '#888',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalScroll: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});
