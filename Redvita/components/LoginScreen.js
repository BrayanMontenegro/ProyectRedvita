import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient"; // Esta es la importación correcta para el gradiente

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar los mensajes de error

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Ingresa tu correo y contraseña.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario autenticado:", user);
      setErrorMessage(""); // Limpiar el mensaje de error en caso de éxito
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage("Contraseña incorrecta."); // Mensaje de error en la pantalla
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("Registro");
  };

  return (
    <LinearGradient
      colors={["#005e72", "#e90101"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage(""); // Limpiar el mensaje de error al escribir
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage(""); // Limpiar el mensaje de error al escribir
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require("../icons/IconsRegistro/ocultar.png")
                    : require("../icons/IconsRegistro/ver.png")
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {/* Mensaje de error pequeño, alineado a la derecha */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          accessibilityLabel="Botón de inicio de sesión"
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
          accessibilityLabel="Botón para crear una cuenta"
        >
          <Text style={styles.createAccountText}>Crear una cuenta</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente para el contenido
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 36, // Tamaño del título aumentado
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#005e72", // Color azul de la paleta para los labels
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#005e72",
  },
  errorText: {
    color: "#e90101", // Color rojo para el texto del error
    fontSize: 12, // Texto más pequeño
    marginTop: 5,
    textAlign: "right", // Alineado a la derecha
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#e90101",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50, // Botón más redondeado
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountButton: {
    marginTop: 20,
  },
  createAccountText: {
    color: "#005e72",
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default LoginScreen;
