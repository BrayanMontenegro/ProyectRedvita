import React, { useState, useEffect, useMemo } from "react";
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
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width, height } = Dimensions.get("window");

// Debounce function to delay the execution of queries
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
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [userError, setUserError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cedulaError, setCedulaError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [progress, setProgress] = useState(0);   // Progreso de la carga

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
    setUserError("");
    setEmailError("");
    setCedulaError("");
    setFormError("");
  };

  // Función para formatear la cédula al estilo ###-######-#####
  const formatCedula = (value) => {
    value = value.replace(/[^0-9A-Za-z]/g, ""); // Remover todo menos números y letras
    if (value.length > 3) value = value.slice(0, 3) + "-" + value.slice(3); // Añadir primer guion
    if (value.length > 10) value = value.slice(0, 10) + "-" + value.slice(10); // Añadir segundo guion
    return value.slice(0, 16); // Limitar a 16 caracteres, incluyendo letras al final
  };

  // Verificar si la cédula ya existe en Firestore
  const checkCedulaInFirestore = async (value) => {
    const cedulaSnapshot = await getDocs(
      query(collection(db, "usuarios"), where("numeroCedula", "==", value))
    );
    if (!cedulaSnapshot.empty) {
      setCedulaError("La cédula ya está registrada.");
    } else {
      setCedulaError("");
    }
  };

  // Verificar si el correo electrónico ya existe en Firestore
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

  const debouncedCheckCedula = useMemo(() => debounce(checkCedulaInFirestore, 500), []);
  const debouncedCheckEmail = useMemo(() => debounce(checkEmailInFirestore, 500), []);

  // Manejo de cambios en los campos de credenciales, aplicando el formato de cédula
  const handleCredentialsChange = (field, value) => {
    if (field === "numeroCedula") {
      value = formatCedula(value);
      debouncedCheckCedula(value); // Validar si la cédula ya existe
    }
    setCredentials({ ...credentials, [field]: value });
  };

  // Manejo de cambios en los campos del usuario
  const handleInputChange = (field, value) => {
    if (field === "correoElectronico") {
      debouncedCheckEmail(value); // Validar si el correo ya existe
    }
    setUserData({ ...userData, [field]: value });
  };

  // Verificar que el formulario sea válido antes de continuar
  const validateForm = () => {
    const { nombres, apellidos, nombreUsuario, correoElectronico, contraseña } = userData;
    if (!nombres || !apellidos || !nombreUsuario || !correoElectronico || !contraseña) {
      setFormError("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  // Deshabilitar el botón "Siguiente" si hay errores en cédula o correo
  const isNextButtonDisabled = useMemo(() => {
    return cedulaError || emailError || !validateForm();
  }, [cedulaError, emailError, userData, credentials]);

  // Deshabilitar el botón "Guardar" si la cédula está registrada
  const isSaveButtonDisabled = useMemo(() => {
    return cedulaError || loading;
  }, [cedulaError, loading]);

  // Guardar los datos en Firebase (solo cuando se presiona "Guardar" en el modal de credenciales)
  const handleSaveCredentials = async () => {
    setLoading(true); // Inicia la carga
    try {
      // Crear usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.correoElectronico,
        userData.contraseña
      );
      const user = userCredential.user;

      let photoURL = ""; // Inicializamos la variable para la URL de la foto

      // Si se seleccionó una foto, súbela a Firebase Storage
      if (userData.fotoPerfil) {
        const response = await fetch(userData.fotoPerfil);
        const blob = await response.blob();
        const storageRef = ref(storage, `fotosPerfil/${user.uid}.jpg`);

        // Usar `uploadBytesResumable` para obtener el progreso
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Monitorear el progreso de la carga
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(progressPercentage); // Actualizar el progreso
            },
            (error) => {
              console.log("Error al subir la imagen: ", error);
              reject(error);
            },
            async () => {
              // Obtener la URL de descarga de la imagen desde Firebase Storage
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Guardar los datos del usuario en Firestore, incluyendo la URL de la foto de perfil si existe
      await addDoc(collection(db, "usuarios"), {
        uid: user.uid,
        ...userData,
        fotoPerfil: photoURL, // Guardar la URL de la foto en Firestore
        ...credentials,
      });

      // Mostrar alerta de éxito y redirigir a la pantalla de login
      Alert.alert("Registro Exitoso", "Los datos han sido guardados correctamente.", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
            setLoading(false); // Detener la carga
            navigation.navigate("Login");
          },
        },
      ]);
    } catch (e) {
      console.error("Error al guardar en Firebase: ", e);
      Alert.alert("Error", "Hubo un problema al guardar los datos.");
      setLoading(false); // Detener la carga en caso de error
    }
  };

  // Función para seleccionar imagen
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20 }}>
          {/* Logo */}
          <Image
            source={require("../assets/logo_horizontal_con_slogan.png")} 
            style={{ width: width * 0.8, height: height * 0.1, marginBottom: 20 }}
            resizeMode="contain"
          />

          {/* Foto de perfil */}
          <TouchableOpacity
            disabled={loading} // Deshabilitar cuando esté guardando
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
              <Text style={styles.inputLabel}>Nombres</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese sus nombres"
              onFocus={() => setInputFocus({ ...inputFocus, nombres: true })}
              onBlur={() => setInputFocus({ ...inputFocus, nombres: false })}
              onChangeText={(value) => handleInputChange("nombres", value)}
              value={userData.nombres}
              editable={!loading} // Deshabilitar mientras se guarda
            />
          </View>

          {/* Apellidos */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
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
              editable={!loading} // Deshabilitar mientras se guarda
            />
          </View>

          {/* Nombre de usuario */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["nombreUsuario"] || userData["nombreUsuario"] ? (
              <Text style={styles.inputLabel}>Nombre de usuario</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese un nombre de usuario"
              maxLength={15} // Limitar a 15 caracteres
              onFocus={() => setInputFocus({ ...inputFocus, nombreUsuario: true })}
              onBlur={() => setInputFocus({ ...inputFocus, nombreUsuario: false })}
              onChangeText={(value) => handleInputChange("nombreUsuario", value)}
              value={userData.nombreUsuario}
              editable={!loading} // Deshabilitar mientras se guarda
            />
            <Text style={styles.charCounter}>{userData.nombreUsuario.length}/15</Text>
          </View>

          {/* Correo electrónico */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative" }}>
            {inputFocus["correoElectronico"] || userData["correoElectronico"] ? (
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Ingrese un correo electrónico"
              keyboardType="email-address"
              onFocus={() => setInputFocus({ ...inputFocus, correoElectronico: true })}
              onBlur={() => setInputFocus({ ...inputFocus, correoElectronico: false })}
              onChangeText={(value) => handleInputChange("correoElectronico", value)}
              value={userData.correoElectronico}
              editable={!loading} // Deshabilitar mientras se guarda
            />
            {emailError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{emailError}</Text> : null}
          </View>

          {/* Contraseña */}
          <View style={{ width: "100%", marginBottom: 15, position: "relative", flexDirection: "row", alignItems: "center" }}>
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
              editable={!loading} // Deshabilitar mientras se guarda
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 15 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={showPassword ? require("../icons/IconsRegistro/ver.png") : require("../icons/IconsRegistro/ocultar.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Validación de formulario */}
          {formError ? <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{formError}</Text> : null}

          {/* Botones */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFields} disabled={loading}>
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

          {/* Modal para registro de credenciales */}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Text style={styles.modalTitle}>Registro de Credenciales</Text>

                  {/* Progreso durante el guardado */}
                  {loading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#4CAF50" />
                      <Text style={styles.loadingText}>Guardando... {Math.round(progress)}%</Text>
                    </View>
                  )}

                  {/* Selección de fecha de nacimiento */}
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
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
                        const fixedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                        setCredentials({ ...credentials, fechaNacimiento: fixedDate.toISOString().split("T")[0] });
                        setShowDatePicker(false);
                      }}
                    />
                  )}

                  <View style={{ marginBottom: 15 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su número de cédula"
                      onChangeText={(value) => handleCredentialsChange("numeroCedula", value)}
                      value={credentials.numeroCedula}
                      editable={!loading} // Deshabilitar mientras se guarda
                    />
                    {cedulaError ? <Text style={{ color: "red", fontSize: 12 }}>{cedulaError}</Text> : null}
                  </View>

                  {/* Otros campos */}
                  <View style={{ marginBottom: 15 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su comunidad"
                      onChangeText={(value) => handleCredentialsChange("comunidad", value)}
                      value={credentials.comunidad}
                      editable={!loading} // Deshabilitar mientras se guarda
                    />
                  </View>

                  <View style={{ marginBottom: 15 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su municipio"
                      onChangeText={(value) => handleCredentialsChange("municipio", value)}
                      value={credentials.municipio}
                      editable={!loading} // Deshabilitar mientras se guarda
                    />
                  </View>

                  <View style={{ marginBottom: 15 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su departamento"
                      onChangeText={(value) => handleCredentialsChange("departamento", value)}
                      value={credentials.departamento}
                      editable={!loading} // Deshabilitar mientras se guarda
                    />
                  </View>

                  <View style={{ marginBottom: 15 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese su edad"
                      keyboardType="numeric"
                      onChangeText={(value) => handleCredentialsChange("edad", value)}
                      value={credentials.edad}
                      editable={!loading} // Deshabilitar mientras se guarda
                    />
                  </View>

                  <Picker
                    selectedValue={credentials.genero}
                    onValueChange={(itemValue) => handleCredentialsChange("genero", itemValue)}
                    style={styles.picker}
                    enabled={!loading} // Deshabilitar mientras se guarda
                  >
                    <Picker.Item label="Seleccione Género" value="" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                  </Picker>
                </ScrollView>

                <View style={styles.modalActionButtons}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleSaveCredentials}
                    disabled={isSaveButtonDisabled} // Deshabilitar el botón si hay errores en la cédula o si está cargando
                  >
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                    disabled={loading} // Deshabilitar mientras se guarda
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal para seleccionar foto */}
          <Modal visible={photoModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.photoModalContent}>
                <Text style={styles.modalTitle}>Seleccionar Foto</Text>

                {selectedPhoto ? (
                  <View style={styles.selectedPhotoContainer}>
                    <Image source={{ uri: selectedPhoto }} style={styles.selectedPhoto} />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={styles.photoButton}
                      onPress={() => pickImage(true)}
                    >
                      <Image
                        source={require("../icons/IconsRegistro/camara.png")}
                        style={styles.iconButton}
                      />
                      <Text style={styles.photoButtonText}>Tomar Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.photoButton}
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
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmPhoto}>
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
                    <Text style={styles.buttonText}>{selectedPhoto ? "Editar" : "Cancelar"}</Text>
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
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
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
  charCounter: {
    position: "absolute",
    right: 15,
    top: 15,
    color: "#888",
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4CAF50",
  },
  photoModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedPhotoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginBottom: 20,
  },
  selectedPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  photoButtonText: {
    fontSize: 16,
    color: "#000",
  },
  photoButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    textAlign: "center",
  },
});
