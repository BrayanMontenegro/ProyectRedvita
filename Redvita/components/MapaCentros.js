import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Footer from "./Footer";
import Header from "./Header";

const CentrosDonacionMap = () => {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    // Consulta para traer los centros de donación
    const unsubscribe = onSnapshot(collection(db, "centros_donacion"), (querySnapshot) => {
      const centrosList = [];
      querySnapshot.forEach((doc) => {
        centrosList.push({ ...doc.data(), id: doc.id });
      });
      setCentros(centrosList);
      setLoading(false);
    });

    // Cleanup para cancelar la suscripción
    return () => unsubscribe();
  }, []);

  const handleLocateCenter = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000); // Duración de la animación en milisegundos
    }
  };

  const renderCentro = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.message}>{item.ubicacion}</Text>
        <View style={styles.buttonContainer}>
          <Button
            color={"#003153"}
            title="Ubicar"
            onPress={() => handleLocateCenter(item.latitud, item.longitud)}
          />
        </View>
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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 12.1, // Configuración inicial del mapa
          longitude: -85.36,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <UrlTile
          urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {centros.map((centro) => (
          <Marker
            key={centro.id}
            coordinate={{
              latitude: centro.latitud,
              longitude: centro.longitud,
            }}
            title={centro.nombre}
            description={centro.ubicacion}
          />
        ))}
      </MapView>
      <View style={styles.listContainer}>
        <FlatList
          data={centros}
          renderItem={renderCentro}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
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
    marginTop : 11,
  },
  map: {
    borderWidth:3,
    borderColor: "#C70039",
    flex:1,
    width: "100%",
    height: "50%", // Cambia este valor si es necesario
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  flatList: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C70039",
    borderRadius: 8,
  },
  containerhed:{
    flex:0.3, 
    },
  containerfot:{
    flex:0.2,
    },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#005e72",
    },
  message: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
    color: "#005e72",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CentrosDonacionMap;
