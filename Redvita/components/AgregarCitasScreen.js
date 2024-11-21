import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Footer from "./Footer";
import Header from "./Header";
import Ionicons from "react-native-vector-icons/Ionicons";

const AgendarCitaDonacion = () => {
  const [centroDonacion, setCentroDonacion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const getCurrentUserId = async () => {
    try {
      const user = await auth.currentUser;
      return user ? user.uid : null;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return null;
    }
  };

  const getUserData = async (userId) => {
    const q = query(collection(db, "usuario_donante"), where("uid", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No se encontraron datos del usuario con UID:", userId);
        return null;
      }
      const userData = querySnapshot.docs[0].data();
      console.log("Datos del Usuario obtenidos:", userData);
      return userData;
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  };

  const handleAgendarCita = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const uid = await getCurrentUserId();
      if (!uid) {
        console.log("Usuario no logueado.");
        setLoading(false);
        setErrorMessage("Usuario no logueado.");
        return;
      }

      const userData = await getUserData(uid);
      if (!userData) {
        setLoading(false);
        setErrorMessage("No se encontraron datos del usuario.");
        return;
      }

      if (!fecha || !descripcion) {
        setErrorMessage("Por favor, completa todos los campos.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "citas_donacion"), {
        uid,
        centroDonacion,
        nombresDonante: userData.nombres,
        apellidoDonante: userData.apellidos,
        correoDonante: userData.correoElectronico,
        operadorDonante: userData.tipoOperador,
        telefonoDonante: userData.telefono,
        fecha,
        descripcion,
        estado: "pendiente",
        timestamp: serverTimestamp(),
      });

      setLoading(false);
      Alert.alert("Éxito", "Cita de donación agendada correctamente.");
      setCentroDonacion("");
      setFecha(new Date());
      setDescripcion("");
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      setLoading(false);
      setErrorMessage("Error al agendar la cita. Inténtalo de nuevo.");
    }
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShow(false);
    setFecha(currentDate);
  };

  return (
    <View style={styles.container}>
         <View style={styles.containerhed}>
     <Header />
     </View>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Agendar Cita de Donación</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de la Cita</Text>
          <TouchableOpacity onPress={() => setShow(true)} style={styles.dateButton}>
            <Text style={fecha ? styles.dateText : styles.placeholderText}>
              {fecha ? formatDate(fecha) : "Selecciona la fecha"}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="gray" />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fecha || new Date()}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción de la Cita</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa una descripción"
            value={descripcion}
            onChangeText={(text) => {
              setDescripcion(text);
              setErrorMessage("");
            }}
            placeholderTextColor="#aaa"
            editable={!loading}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAgendarCita} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Agendar Cita</Text>
          )}
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginTop:5,
  },
  innerContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005e72",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#005e72",
    marginBottom: 5,
  },
  containerfot:{
    flex:0.2,
    },
  containerhed:{
    flex:0.4, 
    },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#004D40",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#e90101",
    fontSize: 14,
    marginTop: 10,
  },
  dateButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    flexGrow: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
    flexGrow: 1,
  },
});

export default AgendarCitaDonacion;
