import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar autenticación
import { db } from "../firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Obtenemos la instancia de autenticación
  const user = auth.currentUser; // Usuario autenticado

  useEffect(() => {
    if (!user) {
      console.error("No hay un usuario autenticado.");
      return;
    }
  
    const uid = user.uid;
  

    // Consulta para traer notificaciones
    const q = query(collection(db, "notificaciones"), orderBy("timestamp", "desc"));
    const unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
      const notifList = [];
      querySnapshot.forEach((doc) => {
        notifList.push({ ...doc.data(), id: doc.id });
      });
      setNotifications(notifList);
    });

     // Consulta solo con `where` sin `orderBy`
  const qCitas = query(collection(db, "citas_donacion"), where("uid", "==", uid));
  const unsubscribeCitas = onSnapshot(qCitas, (querySnapshot) => {
    const citasList = [];
    querySnapshot.forEach((doc) => {
      citasList.push({ ...doc.data(), id: doc.id });
    });
    citasList.sort((a, b) => b.fecha.seconds - a.fecha.seconds);

    setCitas(citasList);
    setLoading(false);
  });

  return () => unsubscribeCitas();
}, [user]);

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

  const renderCita = ({ item }) => (
    <Card style={[styles.card, styles.citaCard]}>
      <Card.Content>
        <Text style={styles.title}>Cita de {item.nombresDonante}</Text>
        <Text style={styles.message}>Estado: {item.estado || ""}</Text>
        <Text style={styles.message}>Centro: {item.centroDonacion || "en espera"}</Text>
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
         <View style={styles.containerhed}>
     <Header />
     </View>
     <View style={styles.containernot}> 
      <Text style={styles.sectionTitle}>Notificaciones</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
      </View>
      <View style={styles.containercit}>
      <Text style={styles.sectionTitle}>Mis Citas de Donación</Text>
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id}
      />
      </View>
          <View style={styles.containerfot}>
            <Footer />
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  containernot:{
    flex:1,
  },
  containercit:{
    flex:1,
  },
  containerfot:{
    flex:0.27,
    },
  containerhed:{
    flex:0.5, 
    },
  card: {
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#C70039",
  },
  citaCard: {
    borderWidth: 3,
    borderColor: "#003153",
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
