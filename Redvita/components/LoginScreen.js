import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Campo para el correo
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar los mensajes de error
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoading(false);
      setErrorMessage("");
      navigation.navigate("Home"); // Redirigir a la pantalla principal después del inicio de sesión
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setErrorMessage("El correo o la contraseña son incorrectos.");
        setPassword(""); // Limpiar el campo de la contraseña
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo es inválido.");
      } else {
        setErrorMessage("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <LinearGradient colors={["#005e72", "#e90101"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a</Text>

        {/* Logo de la aplicación */}
        <Image
          source={require("../assets/logo_horizontal_con_slogan.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Campo para correo electrónico */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
            editable={!loading}
          />
        </View>

        {/* Campo de contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage("");
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
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
        </View>

        {/* Botón de Iniciar Sesión */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          accessibilityLabel="Botón de inicio de sesión"
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("Registro")}
          disabled={loading}
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
    alignItems: "center", // Alineación centrada del contenido
  },
  title: {
    fontSize: 36, // Tamaño del título aumentado
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20, // Espaciado superior del logo
  },
  logo: {
    width: "70%", // Ajusta el tamaño del logo
    height: 120, // Altura del logo
    marginBottom: 40, // Margen inferior para espaciar los campos de entrada
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
