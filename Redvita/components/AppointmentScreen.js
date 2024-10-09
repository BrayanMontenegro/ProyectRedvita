import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importamos el nuevo DateTimePicker
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "./Footer";
import Header from "./Header";

const AgendarCitaDonacion = () => {
  const [centroDonacion, setCentroDonacion] = useState(""); // Campo para centro de donación
  const [donante, setDonante] = useState(""); // Campo para el nombre del donante
  const [fecha, setFecha] = useState(new Date());
  const [show, setShow] = useState(false); // Controla cuándo mostrar el DateTimePicker
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar los mensajes de error

  // Función para manejar la cita
  const handleAgendarCita = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!centroDonacion || !donante || !fecha) {
      setErrorMessage("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "citas_donacion"), {
        centroDonacion,
        donante,
        fecha,
        timestamp: new Date(), // Agregar un campo de timestamp para ordenar las citas
      });
      setLoading(false);
      Alert.alert("Éxito", "Cita de donación agendada correctamente.");
      setCentroDonacion(""); // Limpiar el formulario
      setDonante("");
      setFecha(new Date());
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error al agendar la cita. Inténtalo de nuevo.");
    }
  };

  // Función para manejar el cambio de fecha
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShow(Platform.OS === "ios"); // Oculta el DateTimePicker en Android
    setFecha(currentDate);
  };

  // Función para mostrar el selector de fecha
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <LinearGradient colors={["#005e72", "#e90101"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Agendar Cita de Donación</Text>

        {/* Campo para centro de donación */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Centro de Donación</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el centro de donación"
            value={centroDonacion}
            onChangeText={(text) => {
              setCentroDonacion(text);
              setErrorMessage("");
            }}
            placeholderTextColor="#aaa"
            editable={!loading}
          />
        </View>

        {/* Campo para el nombre del donante */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Donante</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={donante}
            onChangeText={(text) => {
              setDonante(text);
              setErrorMessage("");
            }}
            placeholderTextColor="#aaa"
            editable={!loading}
          />
        </View>

        {/* Fecha de la cita */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de la Cita</Text>
          <Button onPress={showDatepicker} title="Selecciona la fecha" />

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fecha}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
          
        </View>

        {/* Botón para agendar */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAgendarCita}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Agendar Cita</Text>
          )}
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        
      </View>
      <Footer/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
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
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#e90101",
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
});

export default AgendarCitaDonacion;
