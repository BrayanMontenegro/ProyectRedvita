import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [citas, setCitas] = useState([]); // Estado para las citas
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consulta para traer notificaciones
    const q = query(collection(db, "notificaciones"), orderBy("timestamp", "desc"));
    const unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
      const notifList = [];
      querySnapshot.forEach((doc) => {
        notifList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setNotifications(notifList);
    });

    // Consulta para traer citas de donación
    const qCitas = query(collection(db, "citas_donacion"), orderBy("fecha", "desc"));
    const unsubscribeCitas = onSnapshot(qCitas, (querySnapshot) => {
      const citasList = [];
      querySnapshot.forEach((doc) => {
        citasList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setCitas(citasList);
      setLoading(false);
    });

    // Limpieza al desmontar el componente
    return () => {
      unsubscribeNotifications();
      unsubscribeCitas();
    };
  }, []);

  // Función para renderizar una notificación
  const renderNotification = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.message}>{item.mensaje}</Text>
        <Text style={styles.date}>
          {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );

  // Función para renderizar una cita
  const renderCita = ({ item }) => (
    <Card style={[styles.card, styles.citaCard]}>
      <Card.Content>
        <Text style={styles.title}>Centro de Donación: {item.centroDonacion}</Text>
        <Text style={styles.message}>Donante: {item.donante}</Text>
        <Text style={styles.date}>
          Fecha: {new Date(item.fecha.seconds * 1000).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>Notificaciones</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>Citas de Donación</Text>
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id}
      />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  card: {
    marginBottom: 10,
  },
  citaCard: {
    backgroundColor: "#f9e79f", // Color diferente para las citas
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    marginTop: 10,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default NotificationCenter;
