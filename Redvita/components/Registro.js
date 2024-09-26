// Importación de dependencias necesarias
import React, { useState, useEffect, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Para la selección de imágenes
import { Dimensions } from "react-native"; // Obtener dimensiones de la pantalla
import { auth, db, storage } from "../firebaseConfig"; // Firebase para autenticación y almacenamiento
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Firebase Firestore
import { createUserWithEmailAndPassword } from "firebase/auth"; // Registro de usuario con Firebase Auth
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Subida de imágenes a Firebase Storage
import { Picker } from "@react-native-picker/picker"; // Selector de datos
import DateTimePicker from "@react-native-community/datetimepicker"; // Selector de fecha
import CryptoJS from "crypto-js"; // Importamos crypto-js para el hashing de contraseñas
import * as Font from "expo-font"; // Para cargar fuentes personalizadas
import { useFonts } from "expo-font"; // Hook para manejar las fuentes
import AppLoading from "expo-app-loading"; // Para manejar la carga inicial si las fuentes aún no están listas
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat"; // Importa las fuentes Montserrat

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

// Función de debounce para evitar múltiples llamadas repetitivas
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId); // Limpiar timeout si ya existe
    timeoutId = setTimeout(() => {
      func(...args); // Ejecutar la función después del retraso especificado
    }, delay);
  };
};

// Componente principal de registro de usuario
export default function RegistroUsuario({ navigation }) {
  // Estados para almacenar la información del usuario y las credenciales
  const [userData, setUserData] = useState({
    nombres: "",
    apellidos: "",
    nombreUsuario: "",
    correoElectronico: "",
    contraseña: "",
    telefono: "",
    tipoOperador: "",
    fotoPerfil: null,
  });

  const [credentials, setCredentials] = useState({
    fechaNacimiento: "",
    numeroCedula: "",
    comunidad: "",
    municipio: "",
    departamento: "",
    genero: "",
    tipoSangre: "",
  });

  // Estados adicionales para controlar la interfaz y validaciones
  const [inputFocus, setInputFocus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Estados para manejar errores de validación
  const [userError, setUserError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cedulaError, setCedulaError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [formError, setFormError] = useState("");

  // Estados para controlar la carga y el progreso de la subida de datos
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Función para limpiar los campos del formulario
  const clearFields = () => {
    setUserData({
      nombres: "",
      apellidos: "",
      nombreUsuario: "",
      correoElectronico: "",
      contraseña: "",
      telefono: "",
      tipoOperador: "",
      fotoPerfil: null,
    });
    setCredentials({
      fechaNacimiento: "",
      numeroCedula: "",
      comunidad: "",
      municipio: "",
      departamento: "",
      genero: "",
      tipoSangre: "",
    });
    setSelectedPhoto(null); // Limpiar la foto seleccionada
    setUserError(""); // Limpiar errores
    setEmailError("");
    setCedulaError("");
    setTelefonoError("");
    setFormError("");
  };

  // Función para formatear la cédula (añadir guiones donde corresponda)
  const formatCedula = (value) => {
    value = value.replace(/[^0-9A-Za-z]/g, ""); // Eliminar caracteres no permitidos
    if (value.length > 3) value = value.slice(0, 3) + "-" + value.slice(3); // Añadir el primer guion
    if (value.length > 10) value = value.slice(0, 10) + "-" + value.slice(10); // Añadir el segundo guion
    return value.slice(0, 16); // Limitar a 16 caracteres
  };

  // Función para formatear el número de teléfono
  const formatTelefono = (value) => {
    value = value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
    if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4); // Añadir guion después del cuarto dígito
    return value.slice(0, 9); // Limitar a 9 caracteres
  };

  // Validación básica del correo electrónico (sin espacios y formato adecuado)
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para formato de correo
    if (value.includes(" ")) {
      setEmailError("El correo electrónico no debe contener espacios.");
    } else if (!emailRegex.test(value)) {
      setEmailError("El correo electrónico es inválido.");
    } else {
      setEmailError(""); // Limpiar error si es válido
    }
  };

  // Función para verificar si la cédula ya está registrada en la base de datos
  const checkCedulaInFirestore = async (value) => {
    const cedulaSnapshot = await getDocs(
      query(
        collection(db, "usuario_donante"),
        where("numeroCedula", "==", value)
      )
    );
    if (!cedulaSnapshot.empty) {
      setCedulaError("La cédula ya está registrada."); // Mostrar error si ya existe
    } else {
      setCedulaError(""); // Limpiar error si no existe
    }
  };

  // Función para verificar si el correo ya está registrado en la base de datos
  const checkEmailInFirestore = async (value) => {
    const emailSnapshot = await getDocs(
      query(
        collection(db, "usuario_donante"),
        where("correoElectronico", "==", value)
      )
    );
    if (!emailSnapshot.empty) {
      setEmailError("El correo electrónico ya está registrado."); // Mostrar error si ya existe
    } else {
      setEmailError(""); // Limpiar error si no existe
    }
  };

  // Función para verificar si el teléfono ya está registrado en la base de datos
  const checkTelefonoInFirestore = async (value) => {
    const telefonoSnapshot = await getDocs(
      query(collection(db, "usuario_donante"), where("telefono", "==", value))
    );
    if (!telefonoSnapshot.empty) {
      setTelefonoError("El número de teléfono ya está registrado."); // Mostrar error si ya existe
    } else {
      setTelefonoError(""); // Limpiar error si no existe
    }
  };

  // Uso de debounce para limitar las solicitudes de verificación en tiempo real
  const debouncedCheckCedula = useMemo(
    () => debounce(checkCedulaInFirestore, 500),
    []
  );
  const debouncedCheckEmail = useMemo(
    () => debounce(checkEmailInFirestore, 500),
    []
  );
  const debouncedCheckTelefono = useMemo(
    () => debounce(checkTelefonoInFirestore, 500),
    []
  );

  // Función para manejar los cambios en las credenciales
  const handleCredentialsChange = (field, value) => {
    if (field === "numeroCedula") {
      value = formatCedula(value); // Formatear la cédula
      debouncedCheckCedula(value); // Verificar si ya existe
    }
    setCredentials({ ...credentials, [field]: value }); // Actualizar el estado
  };

  // Función para manejar los cambios en los datos del usuario
  const handleInputChange = (field, value) => {
    if (field === "correoElectronico") {
      validateEmail(value); // Validar el correo
      debouncedCheckEmail(value); // Verificar si ya existe
    }
    if (field === "telefono") {
      value = formatTelefono(value); // Formatear el teléfono
      debouncedCheckTelefono(value); // Verificar si ya existe
    }
    setUserData({ ...userData, [field]: value }); // Actualizar el estado
  };

  // Función para validar que todos los campos obligatorios estén completos
  const validateForm = () => {
    const {
      nombres,
      apellidos,
      nombreUsuario,
      correoElectronico,
      contraseña,
      telefono,
      tipoOperador,
    } = userData;
    if (
      !nombres ||
      !apellidos ||
      !nombreUsuario ||
      !correoElectronico ||
      !contraseña ||
      !telefono ||
      !tipoOperador
    ) {
      setFormError("Todos los campos son obligatorios."); // Mostrar error si falta algún campo
      return false;
    }
    return true; // Si todos los campos están completos, devolver true
  };

  // Controla si el botón de "Siguiente" debe estar deshabilitado o no
  const isNextButtonDisabled = useMemo(() => {
    return cedulaError || emailError || telefonoError || !validateForm();
  }, [cedulaError, emailError, telefonoError, userData, credentials]);

  // Controla si el botón de "Guardar" debe estar deshabilitado o no
  const isSaveButtonDisabled = useMemo(() => {
    return cedulaError || loading;
  }, [cedulaError, loading]);

  // Función para manejar el guardado de las credenciales en Firebase
  const handleSaveCredentials = async () => {
    setLoading(true); // Indicar que se está cargando
    try {
      // Verificar que la contraseña no esté vacía o indefinida
      if (!userData.contraseña || userData.contraseña.trim() === "") {
        throw new Error("La contraseña no puede estar vacía.");
      }

      // Hash de la contraseña usando crypto-js
      const hashedPassword = CryptoJS.SHA256(userData.contraseña).toString(); // Hash con SHA256

      // Crear usuario en Firebase Authentication con la contraseña original (Firebase ya aplica su propio hash)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.correoElectronico,
        userData.contraseña // Contraseña original aquí porque Firebase tiene su propio sistema de hash
      );
      const user = userCredential.user;

      let photoURL = ""; // URL de la foto de perfil subida

      // Si se seleccionó una foto de perfil, subirla a Firebase Storage
      if (userData.fotoPerfil) {
        const response = await fetch(userData.fotoPerfil);
        const blob = await response.blob();
        const storageRef = ref(storage, `fotosPerfil/${user.uid}.jpg`);

        const uploadTask = uploadBytesResumable(storageRef, blob);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progressPercentage =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(progressPercentage); // Actualizar el progreso de la subida
            },
            (error) => {
              console.log("Error al subir la imagen: ", error);
              reject(error); // Manejar errores en la subida
            },
            async () => {
              photoURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtener la URL de la foto subida
              resolve();
            }
          );
        });
      }

      // Guardar los datos del usuario y credenciales en Firestore, incluyendo la contraseña hasheada
      await addDoc(collection(db, "usuario_donante"), {
        uid: user.uid,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        nombreUsuario: userData.nombreUsuario,
        correoElectronico: userData.correoElectronico, // Almacenar el correo
        telefono: userData.telefono,
        tipoOperador: userData.tipoOperador,
        contraseña: hashedPassword, // Guardamos la contraseña hasheada con SHA256 en Firestore
        fotoPerfil: photoURL, // URL de la foto de perfil
        ...credentials,
      });

      // Mostrar alerta de éxito y redirigir al login
      Alert.alert(
        "Registro Exitoso",
        "Los datos han sido guardados correctamente.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setLoading(false);
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (e) {
      console.error("Error al guardar en Firebase: ", e); // Manejar errores
      Alert.alert(
        "Error",
        e.message || "Hubo un problema al guardar los datos."
      );
      setLoading(false); // Terminar la carga
    }
  };

  // Función para seleccionar una imagen, ya sea desde la cámara o galería
  const pickImage = async (fromCamera = false) => {
    let result;
    try {
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 1, // Calidad de la imagen
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          quality: 1,
        });
      }

      if (!result.canceled) {
        setSelectedPhoto(result.assets[0].uri); // Establecer la foto seleccionada
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen: ", error);
    }
  };

  // Función para confirmar la foto seleccionada y guardarla en el estado
  const confirmPhoto = () => {
    setUserData({ ...userData, fotoPerfil: selectedPhoto });
    setPhotoModalVisible(false);
  };

  // Función para formatear la fecha a "DD/MM/YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo de la aplicación */}
          <Image
            source={require("../assets/logo_horizontal_con_slogan.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Foto de perfil */}
          <TouchableOpacity
            disabled={loading}
            style={styles.profilePhotoContainer}
            onPress={() => setPhotoModalVisible(true)}
          >
            {userData.fotoPerfil ? (
              <Image
                source={{ uri: userData.fotoPerfil }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.addPhotoTextContainer}>
                <Text style={styles.addPhotoText}>Agregar una foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Campo de nombres */}
          <View style={styles.inputContainer}>
            {inputFocus["nombres"] || userData["nombres"] ? (
              <Text style={styles.inputLabel}>Nombres</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese sus nombres"
              onFocus={() => setInputFocus({ ...inputFocus, nombres: true })}
              onBlur={() => setInputFocus({ ...inputFocus, nombres: false })}
              onChangeText={(value) => handleInputChange("nombres", value)}
              value={userData.nombres}
              editable={!loading}
            />
          </View>

          {/* Campo de apellidos */}
          <View style={styles.inputContainer}>
            {inputFocus["apellidos"] || userData["apellidos"] ? (
              <Text style={styles.inputLabel}>Apellidos</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese sus apellidos"
              onFocus={() => setInputFocus({ ...inputFocus, apellidos: true })}
              onBlur={() => setInputFocus({ ...inputFocus, apellidos: false })}
              onChangeText={(value) => handleInputChange("apellidos", value)}
              value={userData.apellidos}
              editable={!loading}
            />
          </View>

          {/* Campo de nombre de usuario */}
          <View style={styles.inputContainer}>
            {inputFocus["nombreUsuario"] || userData["nombreUsuario"] ? (
              <Text style={styles.inputLabel}>Nombre de usuario</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese un nombre de usuario"
              maxLength={15} // Limitar a 15 caracteres
              onFocus={() =>
                setInputFocus({ ...inputFocus, nombreUsuario: true })
              }
              onBlur={() =>
                setInputFocus({ ...inputFocus, nombreUsuario: false })
              }
              onChangeText={(value) =>
                handleInputChange("nombreUsuario", value)
              }
              value={userData.nombreUsuario}
              editable={!loading}
            />
            <Text style={styles.charCounter}>
              {userData.nombreUsuario.length}/15
            </Text>
          </View>

          {/* Campo de correo electrónico */}
          <View style={styles.inputContainer}>
            {inputFocus["correoElectronico"] ||
            userData["correoElectronico"] ? (
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese un correo electrónico"
              keyboardType="email-address"
              onFocus={() =>
                setInputFocus({ ...inputFocus, correoElectronico: true })
              }
              onBlur={() =>
                setInputFocus({ ...inputFocus, correoElectronico: false })
              }
              onChangeText={(value) =>
                handleInputChange("correoElectronico", value)
              }
              value={userData.correoElectronico}
              editable={!loading}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Campo de contraseña */}
          <View style={[styles.inputContainer, styles.passwordContainer]}>
            {inputFocus["contraseña"] || userData["contraseña"] ? (
              <Text style={styles.inputLabel}>Contraseña</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              secureTextEntry={!showPassword}
              onFocus={() => setInputFocus({ ...inputFocus, contraseña: true })}
              onBlur={() => setInputFocus({ ...inputFocus, contraseña: false })}
              onChangeText={(value) => handleInputChange("contraseña", value)}
              value={userData.contraseña}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require("../icons/IconsRegistro/ver.png")
                    : require("../icons/IconsRegistro/ocultar.png")
                }
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Campo de teléfono */}
          <View style={styles.inputContainer}>
            {inputFocus["telefono"] || userData["telefono"] ? (
              <Text style={styles.inputLabel}>Teléfono</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese su número de teléfono"
              keyboardType="phone-pad"
              onFocus={() => setInputFocus({ ...inputFocus, telefono: true })}
              onBlur={() => setInputFocus({ ...inputFocus, telefono: false })}
              onChangeText={(value) => handleInputChange("telefono", value)}
              value={userData.telefono}
              editable={!loading}
            />
            {telefonoError ? (
              <Text style={styles.errorText}>{telefonoError}</Text>
            ) : null}
          </View>

          {/* Selector de operador */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Operador</Text>
            <Picker
              selectedValue={userData.tipoOperador}
              onValueChange={(value) =>
                handleInputChange("tipoOperador", value)
              }
              style={styles.picker}
              enabled={!loading}
            >
              <Picker.Item label="Seleccione su operador" value="" />
              <Picker.Item label="Claro" value="Claro" />
              <Picker.Item label="Tigo" value="Tigo" />
              <Picker.Item label="Movistar" value="Movistar" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>

          {/* Mostrar errores del formulario */}
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

          {/* Botones para vaciar campos y continuar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFields}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Vaciar Campos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setModalVisible(true)}
              disabled={isNextButtonDisabled}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          {/* Modal para el registro de credenciales */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <Text style={styles.modalTitle}>
                    Registro de Credenciales
                  </Text>

                  {/* Mostrar progreso mientras se guardan los datos */}
                  {loading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#4CAF50" />
                      <Text style={styles.loadingText}>
                        Guardando... {Math.round(progress)}%
                      </Text>
                    </View>
                  )}

                  {/* Selección de fecha de nacimiento */}
                  <View style={styles.inputContainer}>
                    {inputFocus["fechaNacimiento"] ||
                    credentials["fechaNacimiento"] ? (
                      <Text style={styles.inputLabel}>Fecha nacimiento</Text>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={styles.dateButton}
                    >
                      <Text
                        style={
                          credentials.fechaNacimiento
                            ? styles.dateText
                            : styles.placeholderText
                        }
                      >
                        {credentials.fechaNacimiento
                          ? formatDate(credentials.fechaNacimiento)
                          : "Fecha nacimiento"}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            const fixedDate = new Date(
                              selectedDate.getTime() -
                                selectedDate.getTimezoneOffset() * 60000
                            );
                            setCredentials({
                              ...credentials,
                              fechaNacimiento: fixedDate
                                .toISOString()
                                .split("T")[0],
                            });
                          }
                          setShowDatePicker(false); // Ocultar el DateTimePicker
                        }}
                      />
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su número de cédula"
                      onChangeText={(value) =>
                        handleCredentialsChange("numeroCedula", value)
                      }
                      value={credentials.numeroCedula}
                      editable={!loading}
                    />
                    {cedulaError ? (
                      <Text style={styles.errorText}>{cedulaError}</Text>
                    ) : null}
                  </View>

                  {/* Tipo de Sangre */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Tipo de Sangre</Text>
                    <Picker
                      selectedValue={credentials.tipoSangre}
                      onValueChange={(value) =>
                        handleCredentialsChange("tipoSangre", value)
                      }
                      style={styles.picker}
                      enabled={!loading}
                    >
                      <Picker.Item label="Seleccione Tipo de Sangre" value="" />
                      <Picker.Item label="A+" value="A+" />
                      <Picker.Item label="A-" value="A-" />
                      <Picker.Item label="B+" value="B+" />
                      <Picker.Item label="B-" value="B-" />
                      <Picker.Item label="O+" value="O+" />
                      <Picker.Item label="O-" value="O-" />
                      <Picker.Item label="AB+" value="AB+" />
                      <Picker.Item label="AB-" value="AB-" />
                    </Picker>
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su comunidad"
                      onChangeText={(value) =>
                        handleCredentialsChange("comunidad", value)
                      }
                      value={credentials.comunidad}
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su municipio"
                      onChangeText={(value) =>
                        handleCredentialsChange("municipio", value)
                      }
                      value={credentials.municipio}
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su departamento"
                      onChangeText={(value) =>
                        handleCredentialsChange("departamento", value)
                      }
                      value={credentials.departamento}
                      editable={!loading}
                    />
                  </View>

                  <Picker
                    selectedValue={credentials.genero}
                    onValueChange={(itemValue) =>
                      handleCredentialsChange("genero", itemValue)
                    }
                    style={styles.picker}
                    enabled={!loading}
                  >
                    <Picker.Item label="Seleccione Género" value="" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                  </Picker>
                </ScrollView>

                {/* Botones de confirmación y cancelación */}
                <View style={styles.modalActionButtons}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleSaveCredentials}
                    disabled={isSaveButtonDisabled}
                  >
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal para la selección de foto */}
          <Modal
            visible={photoModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.photoModalContent}>
                <Text style={styles.modalTitle}>Seleccionar Foto</Text>

                {selectedPhoto ? (
                  <View style={styles.selectedPhotoContainer}>
                    <Image
                      source={{ uri: selectedPhoto }}
                      style={styles.selectedPhoto}
                    />
                  </View>
                ) : (
                  <View>
                  <TouchableOpacity
                    style={styles.photoButton} // Aquí defines la fila y alineas a la izquierda
                    onPress={() => pickImage(true)}
                  >
                    <Image
                      source={require("../icons/IconsRegistro/camara.png")}
                      style={styles.iconButton}
                    />
                    <Text style={styles.photoButtonText}>Tomar Foto</Text>
                  </TouchableOpacity>
                
                  <TouchableOpacity
                    style={styles.photoButton} // Aquí también defines la fila y alineas a la izquierda
                    onPress={() => pickImage(false)}
                  >
                    <Image
                      source={require("../icons/IconsRegistro/image.png")}
                      style={styles.iconButton}
                    />
                    <Text style={styles.photoButtonText}>Elegir de la Galería</Text>
                  </TouchableOpacity>
                </View>
                
                )}

                <View style={styles.modalActionButtons}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmPhoto}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      if (selectedPhoto) {
                        setSelectedPhoto(null);
                      } else {
                        setPhotoModalVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {selectedPhoto ? "Editar" : "Cancelar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Área segura que abarca toda la pantalla
  safeArea: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "#FFFFFF", // Fondo blanco
  },

  // Contenedor que ajusta el teclado cuando aparece
  keyboardAvoidingView: {
    flex: 1, // Ocupa todo el espacio disponible
  },

  // Estilo del contenido dentro del ScrollView
  scrollViewContent: {
    alignItems: "center", // Centra el contenido horizontalmente
    flexGrow: 1, 
    paddingBottom: 100, 
    paddingHorizontal: 20 // Ajusta este valor según el espacio que desees en los lados
  },

  // Logo
  logo: {
    width: "80%", // Ocupa el 80% del ancho de la pantalla
    height: "10%", // 10% de la altura de la pantalla
    marginBottom: 20, // Margen inferior de 20px
  },

  // Contenedor para la foto de perfil
  profilePhotoContainer: {
    width: 150, // Ancho de 150px
    height: 150, // Alto de 150px
    borderRadius: 75, // Radio para hacerla circular
    overflow: "hidden", // Esconder el contenido que se salga del borde
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    borderWidth: 1, // Borde de 1px
    borderColor: "#ddd", // Borde gris claro
    marginBottom: 20, // Margen inferior de 20px
  },

  // Foto de perfil seleccionada
  profilePhoto: {
    width: "100%", // Ancho completo del contenedor
    height: "100%", // Alto completo del contenedor
    borderRadius: 75, // Mantiene la imagen circular
  },

  // Contenedor para el texto "Agregar una foto"
  addPhotoTextContainer: {
    justifyContent: "center", // Centrado verticalmente
    alignItems: "center", // Centrado horizontalmente
  },

  // Texto "Agregar una foto"
  addPhotoText: {
    color: "#aaa", // Texto en gris claro
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Contenedor para los inputs
  inputContainer: {
    width: "100%", // Ocupa el ancho completo disponible
    marginBottom: 15, // Margen inferior de 15px
    position: "relative", // Para colocar el label flotante
  },

  // Estilo de los inputs (campos de texto)
  input: {
    width: "100%", // Ocupa todo el ancho disponible
    height: 50, // Alto de 50px
    borderColor: "#ddd", // Borde gris claro
    borderWidth: 1, // Borde de 1px
    borderRadius: 5, // Bordes ligeramente redondeados
    paddingHorizontal: 15, // Espaciado horizontal interno de 15px
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Label flotante que aparece cuando el input está enfocado
  inputLabel: {
    position: "absolute", // Posición absoluta para que esté sobre el input
    top: -10, // Posición encima del input
    left: 15, // Margen desde la izquierda
    backgroundColor: "#FFFFFF", // Fondo blanco para que no se mezcle con el input
    paddingHorizontal: 5, // Espaciado horizontal interno de 5px
    zIndex: 1, // Asegura que el label esté encima del input
    color: "#888", // Texto en gris claro
    fontSize: 14, // Tamaño de fuente de 14px
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Contador de caracteres, como para el nombre de usuario
  charCounter: {
    position: "absolute", // Posición absoluta dentro del input
    right: 15, // Alineado a la derecha
    top: 15, // Alineado con el texto del input
    color: "#888", // Color gris claro
    fontSize: 12, // Fuente pequeña
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Contenedor de la contraseña, con el botón para mostrar/ocultar
  passwordContainer: {
    flexDirection: "row", // Disposición horizontal
    alignItems: "center", // Centra verticalmente
  },

  // Botón de mostrar/ocultar contraseña
  passwordToggle: {
    position: "absolute", // Posición absoluta dentro del input
    right: 15, // Alineado a la derecha
  },

  // Ícono para mostrar/ocultar contraseña
  passwordIcon: {
    width: 20, // Ancho del ícono de 20px
    height: 20, // Alto del ícono de 20px
  },

  // Estilo del selector (Picker)
  picker: {
    width: "100%", // Ancho completo disponible
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Texto de error en rojo
  errorText: {
    color: "#e90101", // Rojo definido
    fontSize: 12, // Fuente pequeña
    marginTop: 5, // Margen superior de 5px
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Contenedor de los botones (Ejemplo: Vaciar Campos, Siguiente)
  buttonContainer: {
    flexDirection: "row", // Disposición horizontal
    justifyContent: "space-between", // Distribución equitativa
    width: "100%", // Ancho completo disponible
    marginTop: 20, // Margen superior de 20px
  },

  // Estilo del botón "Guardar"
  saveButton: {
    backgroundColor: "#005e72", // Azul definido
    padding: 15, // Espaciado interno de 15px
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginHorizontal: 5, // Margen entre botones
  },

  // Estilo del botón "Vaciar Campos"
  clearButton: {
    backgroundColor: "#e90101", // Rojo definido
    padding: 15, // Espaciado interno de 15px
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginHorizontal: 5, // Margen entre botones
  },

  // Texto dentro de los botones
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 16, // Tamaño de fuente 16px
    textAlign: "center", // Centrado horizontalmente
    fontFamily: "Montserrat_700Bold", // Tipografía Montserrat Bold
  },

  // Contenedor del modal
  modalContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente
  },

  // Contenido del modal
  modalContent: {
    width: "90%", // 90% del ancho disponible
    backgroundColor: "#fff", // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    padding: 20, // Espaciado interno de 20px
    paddingBottom: 40, // Espaciado inferior mayor
  },

  // Título del modal
  modalTitle: {
    fontSize: 18, // Tamaño de fuente grande
    fontWeight: "bold", // Texto en negrita
    marginBottom: 20, // Margen inferior de 20px
    fontFamily: "Montserrat_700Bold", // Tipografía Montserrat Bold
  },

  // Contenedor para el indicador de carga y texto de progreso
  loadingContainer: {
    flexDirection: "row", // Disposición horizontal
    justifyContent: "center", // Centrado horizontal
    alignItems: "center", // Centrado vertical
    marginBottom: 20, // Margen inferior de 20px
  },

  // Texto de carga (porcentaje de progreso)
  loadingText: {
    marginLeft: 10, // Margen izquierdo del indicador de carga
    fontSize: 16, // Tamaño de fuente 16px
    color: "#4CAF50", // Texto verde
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Estilo para el botón de selección de fecha
  dateButton: {
    backgroundColor: "#FFFFFF", // Fondo blanco para que coincida con el input
    padding: 15, // Espaciado interno
    borderColor: "#ddd", // Color del borde
    borderWidth: 1, // Ancho del borde
    borderRadius: 5, // Bordes redondeados
    flexDirection: "row", // Disposición horizontal para el texto y el ícono
    justifyContent: "space-between", // Separación entre el texto y el ícono
    alignItems: "center", // Alineación vertical
    width: "100%", // Ocupa todo el ancho del contenedor
  },

  // Texto dentro del botón de selección de fecha
  dateText: {
    fontSize: 16, // Tamaño de fuente para el texto de la fecha
    color: "#000", // Color negro para el texto de la fecha seleccionada
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Placeholder cuando no hay fecha seleccionada
  placeholderText: {
    fontSize: 16, // Tamaño de fuente
    color: "#999", // Color gris claro para el placeholder
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Contenedor del input para unificar el diseño
  inputContainer: {
    width: "100%", // Ocupa todo el ancho disponible
    marginBottom: 15, // Margen inferior de 15px
    position: "relative", // Para poder posicionar el label flotante
  },

  // Label flotante sobre el input
  inputLabel: {
    position: "absolute", // Posición absoluta sobre el input
    top: -10, // Posición encima del input
    left: 15, // Margen desde la izquierda
    backgroundColor: "#FFFFFF", // Fondo blanco
    paddingHorizontal: 5, // Espaciado interno horizontal
    zIndex: 1, // Asegura que esté encima del input
    color: "#888", // Color gris claro
    fontSize: 14, // Tamaño de fuente
    fontFamily: "Montserrat_400Regular", // Tipografía Montserrat Regular
  },

  // Botones de acción en el modal
  modalActionButtons: {
    flexDirection: "row", // Alineación horizontal de los botones
    justifyContent: "space-between", // Distribuir espacio equitativo entre los botones
    width: "100%", // Ocupa todo el ancho disponible
    marginTop: 20, // Añadir un margen superior
  },

  // Estilo del botón de confirmación (Guardar)
  confirmButton: {
    backgroundColor: "#005e72", // Fondo azul definido
    padding: 15, // Espaciado interno
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginRight: 10, // Añadir un pequeño margen entre los botones
    alignItems: "center", // Centrar el texto en el botón
  },

  // Estilo del botón de cancelación (Cancelar)
  cancelButton: {
    backgroundColor: "#e90101", // Fondo rojo definido
    padding: 15, // Espaciado interno
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginLeft: 10, // Añadir un pequeño margen entre los botones
    alignItems: "center", // Centrar el texto en el botón
  },

  // Texto dentro de los botones
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 14, // Tamaño de fuente
    textAlign: "center", // Centrado horizontalmente
    fontFamily: "Montserrat_700Bold", // Tipografía Montserrat Bold
  },
  // Contenedor del modal de selección de foto
  modalContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: "center", // Centrado verticalmente
    alignItems: "center", // Centrado horizontalmente
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente
  },

  // Contenido del modal de selección de foto
  photoModalContent: {
    width: "90%", // 90% del ancho disponible
    backgroundColor: "#fff", // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    padding: 20, // Espaciado interno de 20px
    alignItems: "center", // Centrado de todo el contenido
  },

  // Título del modal de selección de foto
  modalTitle: {
    fontSize: 18, // Tamaño de fuente grande
    fontWeight: "bold", // Texto en negrita
    marginBottom: 20, // Margen inferior de 20px
    fontFamily: "Montserrat_700Bold", // Tipografía Montserrat Bold
  },

  // Contenedor para la foto seleccionada
  selectedPhotoContainer: {
    width: 150, // Ancho de 150px
    height: 150, // Alto de 150px
    borderRadius: 75, // Bordes circulares
    overflow: "hidden", // Esconder contenido que se salga
    marginBottom: 20, // Margen inferior de 20px
  },

  // Foto seleccionada dentro del modal
  selectedPhoto: {
    width: "100%", // Ancho completo del contenedor
    height: "100%", // Alto completo del contenedor
  },

  // Botones de acción en el modal
  modalActionButtons: {
    flexDirection: "row", // Alineación horizontal de los botones
    justifyContent: "space-between", // Distribuir espacio equitativo entre los botones
    width: "100%", // Ocupa todo el ancho disponible
    marginTop: 20, // Añadir un margen superior
  },

  // Estilo del botón de confirmación
  confirmButton: {
    backgroundColor: "#005e72", // Fondo azul
    padding: 15, // Espaciado interno
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginRight: 10, // Margen a la derecha
    alignItems: "center", // Centrar el texto dentro del botón
  },

  // Estilo del botón de cancelación
  cancelButton: {
    backgroundColor: "#e90101", // Fondo rojo
    padding: 15, // Espaciado interno
    borderRadius: 5, // Bordes redondeados
    flex: 1, // Ocupa todo el espacio disponible
    marginLeft: 10, // Margen a la izquierda
    alignItems: "center", // Centrar el texto dentro del botón
  },


  photoButton: {
    flexDirection: "row", // Alinear el ícono y el texto en fila
    alignItems: "center", // Centrar verticalmente ícono y texto
    justifyContent: "flex-start", // Alinear todo el contenido a la izquierda
    padding: 10, // Opcional: para añadir espacio alrededor del contenido
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Blanco con opacidad del 80%
    borderRadius: 5, // Opcional: bordes redondeados
    width: '100%', // Ocupa todo el ancho del botón
  },
  
  iconButton: {
    width: 24, // Ancho del ícono
    height: 24, // Alto del ícono
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  
  
  
});
