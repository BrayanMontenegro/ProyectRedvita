import React, { useState } from "react";
import { StyleSheet } from 'react-native';
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
  Alert,
  Modal,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Dimensions } from "react-native";
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { width, height } = Dimensions.get("window");

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function RegistroUsuario({ navigation }) {
  const [userData, setUserData] = useState({
    nombres: "",
    apellidos: "",
    nombreUsuario: "",
    correoElectronico: "",
    contraseña: "",
    fotoPerfil: null,
  });

  const [credentials, setCredentials] = useState({
    fechaNacimiento: "",
    numeroCedula: "",
    comunidad: "",
    municipio: "",
    departamento: "",
    edad: "",
    genero: "",
  });

  const [inputFocus, setInputFocus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Siguiente");
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [userError, setUserError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [credencialesError, setCredencialesError] = useState("");

  const clearFields = () => {
    setUserData({
      nombres: "",
      apellidos: "",
      nombreUsuario: "",
      correoElectronico: "",
      contraseña: "",
      fotoPerfil: null,
    });
    setCredentials({
      fechaNacimiento: "",
      numeroCedula: "",
      comunidad: "",
      municipio: "",
      departamento: "",
      edad: "",
      genero: "",
    });
    setSelectedPhoto(null);
  };

  const pickImage = async (fromCamera = false) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const confirmPhoto = () => {
    setUserData({ ...userData, fotoPerfil: selectedPhoto });
    setPhotoModalVisible(false);
  };

  const checkUsernameInFirestore = async (value) => {
    const userSnapshot = await getDocs(
      query(collection(db, "usuarios"), where("nombreUsuario", "==", value))
    );
    if (!userSnapshot.empty) {
      setUserError("El nombre de usuario ya está registrado.");
    } else {
      setUserError("");
    }
  };

  const checkEmailInFirestore = async (value) => {
    const emailSnapshot = await getDocs(
      query(collection(db, "usuarios"), where("correoElectronico", "==", value))
    );
    if (!emailSnapshot.empty) {
      setEmailError("El correo electrónico ya está registrado.");
    } else {
      setEmailError("");
    }
  };

  const debouncedCheckUsername = debounce(checkUsernameInFirestore, 500);
  const debouncedCheckEmail = debounce(checkEmailInFirestore, 500);

  const handleInputChange = (field, value) => {
    if (field === "nombreUsuario") {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(value)) {
        setUserError("El nombre de usuario solo puede contener letras, números y guion bajo.");
      } else {
        setUserError("");
        debouncedCheckUsername(value);
      }
    }

    if (field === "correoElectronico") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Ingrese un correo electrónico válido.");
      } else {
        setEmailError("");
        debouncedCheckEmail(value);
      }
    }

    setUserData({ ...userData, [field]: value });
  };

  // Validar formulario de registro inicial
  const validateForm = () => {
    const { nombres, apellidos, nombreUsuario, correoElectronico, contraseña } = userData;
    if (!nombres || !apellidos || !nombreUsuario || !correoElectronico || !contraseña) {
      setFormError("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  // Formatear la cédula al ingresar automáticamente con el formato ###-######-#####
  const formatCedula = (value) => {
    value = value.replace(/[^0-9A-Za-z]/g, ""); // Remover todo menos números y letras
    if (value.length > 3) value = value.slice(0, 3) + "-" + value.slice(3);
    if (value.length > 10) value = value.slice(0, 10) + "-" + value.slice(10);
    return value.slice(0, 16); // Limitar a 16 caracteres
  };

  // Validar formato de cédula y que solo se ingrese números en edad
  const handleCredentialsChange = (field, value) => {
    if (field === "numeroCedula") {
      value = formatCedula(value);
      setCredentials({ ...credentials, [field]: value });

      if (value.length < 16) {
        setCredencialesError("El formato de la cédula debe ser ###-######-#####");
      } else {
        setCredencialesError("");
      }
    } else if (field === "edad") {
      if (isNaN(value) || value <= 0) {
        setCredencialesError("La edad debe ser un número válido.");
      } else {
        setCredencialesError("");
      }
      setCredentials({ ...credentials, [field]: value });
    } else {
      // Permitir la edición de campos como "comunidad", "municipio" y "departamento"
      setCredentials({ ...credentials, [field]: value });
    }
  };

  const validateCredenciales = () => {
    const { numeroCedula, departamento, edad, genero } = credentials;
    if (!numeroCedula || !departamento || !edad || !genero) {
      setCredencialesError("Todos los campos de credenciales son obligatorios.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      setFormError(""); // Limpiar mensaje de error
      setModalVisible(true); // Mostrar el modal de credenciales
    }
  };

  const handleSaveCredentials = async () => {
    if (!validateCredenciales()) {
      return;
    }
    // Guardar los datos de credenciales y usuario
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.correoElectronico,
        userData.contraseña
      );
      const user = userCredential.user;

      let photoURL = "";

      if (userData.fotoPerfil) {
        const response = await fetch(userData.fotoPerfil);
        const blob = await response.blob();

        const photoRef = ref(storage, `fotosPerfil/${user.uid}.jpg`);
        await uploadBytes(photoRef, blob);
        photoURL = await getDownloadURL(photoRef);
      }

      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        ...userData,
        fotoPerfil: photoURL,
        ...credentials,
      });

      Alert.alert("Registro Exitoso", "Los datos han sido guardados en Firebase.", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
            navigation.navigate("Login");
          },
        },
      ]);
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setEmailError("El correo electrónico ya está en uso.");
      } else {
        console.error("Error al guardar en Firebase: ", e);
        Alert.alert("Error", "Hubo un problema al guardar los datos.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20 }}>
          {/* Logo de RedVita */}
          <Image
            source={require("../assets/logo_horizontal_con_slogan.png")} // Logo anterior
            style={{ width: width * 0.8, height: height * 0.1, marginBottom: 20 }}
            resizeMode="contain"
          />

          {/* Contenedor para la foto de perfil */}
          <TouchableOpacity
            style={{ width: 150, height: 150, borderRadius: 75, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#ddd", marginBottom: 20 }}
            onPress={() => setPhotoModalVisible(true)}
          >
            {userData.fotoPerfil ? (
              <Image source={{ uri: userData.fotoPerfil }} style={{ width: "100%", height: "100%", borderRadius: 75 }} />
            ) : (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#aaa" }}>Agregar una foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Nombres */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["nombres"] || userData["nombres"] ? (
              <Text style={{ position: "absolute", top: -10, left: 15, backgroundColor: "#FFFFFF", paddingHorizontal: 5, zIndex: 1, color: "#888", fontSize: 14 }}>Nombres</Text>
            ) : null}
            <TextInput
              style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15 }}
              placeholder="Ingrese sus nombres"
              onFocus={() => setInputFocus({ ...inputFocus, nombres: true })}
              onBlur={() => setInputFocus({ ...inputFocus, nombres: false })}
              onChangeText={(value) => handleInputChange("nombres", value)}
              value={userData["nombres"]}
            />
          </View>

          {/* Apellidos */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["apellidos"] || userData["apellidos"] ? (
              <Text style={{ position: "absolute", top: -10, left: 15, backgroundColor: "#FFFFFF", paddingHorizontal: 5, zIndex: 1, color: "#888", fontSize: 14 }}>Apellidos</Text>
            ) : null}
            <TextInput
              style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15 }}
              placeholder="Ingrese sus apellidos"
              onFocus={() => setInputFocus({ ...inputFocus, apellidos: true })}
              onBlur={() => setInputFocus({ ...inputFocus, apellidos: false })}
              onChangeText={(value) => handleInputChange("apellidos", value)}
              value={userData["apellidos"]}
            />
          </View>

          {/* Nombre de usuario */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["nombreUsuario"] || userData["nombreUsuario"] ? (
              <Text style={{ position: "absolute", top: -10, left: 15, backgroundColor: "#FFFFFF", paddingHorizontal: 5, zIndex: 1, color: "#888", fontSize: 14 }}>Nombre de usuario</Text>
            ) : null}
            <TextInput
              style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15 }}
              placeholder="Ingrese un nombre de usuario"
              onFocus={() => setInputFocus({ ...inputFocus, nombreUsuario: true })}
              onBlur={() => setInputFocus({ ...inputFocus, nombreUsuario: false })}
              onChangeText={(value) => handleInputChange("nombreUsuario", value)}
              value={userData["nombreUsuario"]}
            />
            {userError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{userError}</Text> : null}
          </View>

          {/* Correo electrónico */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["correoElectronico"] || userData["correoElectronico"] ? (
              <Text style={{ position: "absolute", top: -10, left: 15, backgroundColor: "#FFFFFF", paddingHorizontal: 5, zIndex: 1, color: "#888", fontSize: 14 }}>Correo Electrónico</Text>
            ) : null}
            <TextInput
              style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15 }}
              placeholder="Ingrese un correo electrónico"
              keyboardType="email-address"
              onFocus={() => setInputFocus({ ...inputFocus, correoElectronico: true })}
              onBlur={() => setInputFocus({ ...inputFocus, correoElectronico: false })}
              onChangeText={(value) => handleInputChange("correoElectronico", value)}
              value={userData["correoElectronico"]}
            />
            {emailError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{emailError}</Text> : null}
          </View>

          {/* Contraseña */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative", flexDirection: "row", alignItems: "center" }}>
            {inputFocus["contraseña"] || userData["contraseña"] ? (
              <Text style={{ position: "absolute", top: -10, left: 15, backgroundColor: "#FFFFFF", paddingHorizontal: 5, zIndex: 1, color: "#888", fontSize: 14 }}>Contraseña</Text>
            ) : null}
            <TextInput
              style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, flex: 1 }}
              placeholder="Ingrese su contraseña"
              secureTextEntry={!showPassword}
              onFocus={() => setInputFocus({ ...inputFocus, contraseña: true })}
              onBlur={() => setInputFocus({ ...inputFocus, contraseña: false })}
              onChangeText={(value) => handleInputChange("contraseña", value)}
              value={userData.contraseña}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 15 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require("../icons/IconsRegistro/ver.png")
                    : require("../icons/IconsRegistro/ocultar.png")
                }
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Error de validación del formulario */}
          {formError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{formError}</Text> : null}

          {/* Botones */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
            <TouchableOpacity
              style={{ backgroundColor: "#f44336", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
              onPress={clearFields}
            >
              <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Vaciar Campos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
              onPress={handleNext}
            >
              <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

          {/* Modal para registro de credenciales */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
                <ScrollView>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Registro de Credenciales</Text>

                  {/* Campos de credenciales */}
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{ backgroundColor: "#eee", padding: 10, borderRadius: 5, marginVertical: 10 }}
                  >
                    <Text>
                      {credentials.fechaNacimiento ? credentials.fechaNacimiento : "Seleccionar Fecha de Nacimiento"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          const utcDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);
                          setCredentials({
                            ...credentials,
                            fechaNacimiento: utcDate.toISOString().split("T")[0],
                          });
                        }
                        setShowDatePicker(false);
                      }}
                    />
                  )}

                  {["numeroCedula", "comunidad", "municipio", "departamento", "edad"].map((field, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                      <TextInput
                        style={{ width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 15 }}
                        placeholder={`Ingrese su ${field}`}
                        onChangeText={(value) => handleCredentialsChange(field, value)}
                        value={credentials[field]}
                        keyboardType={field === "edad" ? "numeric" : "default"}
                      />
                    </View>
                  ))}

                  <Picker
                    selectedValue={credentials.genero}
                    onValueChange={(itemValue) => setCredentials({ ...credentials, genero: itemValue })}
                    style={{ width: "100%", height: 50 }}
                  >
                    <Picker.Item label="Seleccione Género" value="" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                  </Picker>

                  {/* Error de validación de credenciales */}
                  {credencialesError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{credencialesError}</Text> : null}

                </ScrollView>

                {/* Botones del modal */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                    onPress={handleSaveCredentials}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: "#f44336", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal para seleccionar foto */}
          <Modal
            visible={photoModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Seleccionar Foto</Text>

                {selectedPhoto ? (
                  <View style={{ width: 150, height: 150, borderRadius: 75, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#4CAF50", marginBottom: 20 }}>
                    <Image source={{ uri: selectedPhoto }} style={{ width: "100%", height: "100%", borderRadius: 75 }} />
                  </View>
                ) : (
                  <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
                      onPress={() => pickImage(true)}
                    >
                      <Image source={require("../icons/IconsRegistro/camara.png")} style={{ width: 20, height: 20, marginRight: 10 }} />
                      <Text>Tomar Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center" }}
                      onPress={() => pickImage(false)}
                    >
                      <Image source={require("../icons/IconsRegistro/image.png")} style={{ width: 20, height: 20, marginRight: 10 }} />
                      <Text>Elegir de la Galería</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                    onPress={confirmPhoto}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ backgroundColor: "#f44336", padding: 15, borderRadius: 5, flex: 1, marginHorizontal: 5 }}
                    onPress={() => {
                      if (selectedPhoto) {
                        setSelectedPhoto(null);
                      } else {
                        setPhotoModalVisible(false);
                      }
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>{selectedPhoto ? "Editar" : "Cancelar"}</Text>
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
  // Contenedor principal
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // Estilo del logo
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginBottom: 20,
  },
  // Título principal
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  // Contenedor de la imagen de perfil (donde se verá la imagen seleccionada)
  imageContainer: {
    marginBottom: 20,
    width: 150,
    height: 150,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd", // Color del borde
  },
  // Imagen de perfil seleccionada
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  // Placeholder para cuando no hay imagen seleccionada
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Texto dentro del placeholder
  placeholderText: {
    color: "#aaa", // Color gris claro
  },
  // Contenedor de inputs de texto
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  // Etiqueta flotante sobre el input
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    zIndex: 1,
    color: "#888",
    fontSize: 14,
  },
  // Estilo del input de texto
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  // Icono dentro del input (ej: mostrar/ocultar contraseña)
  inputIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  // Icono del input
  icon: {
    width: 20,
    height: 20,
  },
  // Contenedor de botones en la parte inferior
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  // Estilo general para los botones
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Color de sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Botón de guardar (verde)
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  // Botón para vaciar campos (rojo)
  clearButton: {
    backgroundColor: "#f44336",
  },
  // Texto de los botones
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Botón dentro del modal
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  // Contenedor general del modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  // Contenido del modal
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingBottom: 40,
  },
  // Contenido del modal de selección de foto
  photoModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // Scroll dentro del modal
  modalScroll: {
    alignItems: "center",
    paddingBottom: 40,
  },
  // Título del modal
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  // Botón para seleccionar fecha de nacimiento
  dateButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  // Picker de selección (género, etc.)
  picker: {
    width: "100%",
    height: 50,
  },
  // Botones de opciones (Tomar Foto, Elegir Galería)
  photoButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Icono dentro de los botones de opciones
  iconButton: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  // Texto dentro de los botones de opciones
  photoButtonText: {
    fontSize: 16,
    color: "#000", // Negro
  },
  // Contenedor para la imagen seleccionada en un círculo
  selectedPhotoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50", // Borde verde
    marginBottom: 20,
  },
  // Imagen seleccionada dentro del círculo
  selectedPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 75, // Circular
  },
  // Estilo para los botones de acción (Confirmar, Editar/Cancelar)
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  // Botón de Confirmar (verde)
  confirmButton: {
    backgroundColor: "#4CAF50", // Verde
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  // Botón de Cancelar/Editar (rojo)
  cancelButton: {
    backgroundColor: "#f44336", // Rojo 
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  // Texto de los botones (Confirmar, Cancelar/Editar)
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
