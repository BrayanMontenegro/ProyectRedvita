import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import Footer from "./Footer";

const HistorialDonaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [centrosMap, setCentrosMap] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const fetchCentros = async () => {
    const centrosSnapshot = await getDocs(collection(db, "centros_donacion"));
    const centros = {};
    centrosSnapshot.forEach((doc) => {
      centros[doc.id] = doc.data().nombre;
    });
    setCentrosMap(centros);
  };

  const fetchDonaciones = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "historial_donaciones"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const donacionesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonaciones(donacionesData);
    }
  };

  useEffect(() => {
    fetchCentros();
    fetchDonaciones();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchCentros();
      fetchDonaciones();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    Alert.alert("Eliminar Donación", "¿Estás seguro de que deseas eliminar esta donación?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "historial_donaciones", id));
          setDonaciones(donaciones.filter((donacion) => donacion.id !== id));
          Alert.alert("Eliminado", "La donación ha sido eliminada.");
        },
      },
    ]);
  };

  const handleEdit = (donacion) => {
    setEditingDonation(donacion);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingDonation?.donante || !editingDonation?.cantidad || !editingDonation?.fecha || !editingDonation?.centroDonacion) {
      Alert.alert("Faltan datos", "Por favor completa todos los campos antes de guardar.");
      return;
    }
  
    const donationRef = doc(db, "historial_donaciones", editingDonation.id);
    await updateDoc(donationRef, {
      donante: editingDonation.donante,
      cantidad: parseInt(editingDonation.cantidad),
      fecha: editingDonation.fecha,
      centroDonacion: editingDonation.centroDonacion,
    });
    
    fetchDonaciones();
    setEditModalVisible(false);
    Alert.alert("Guardado", "La donación ha sido actualizada.");
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.donacionItem}>
      <View style={styles.donacionInfo}>
        <Text style={styles.donacionText}>
          <Text style={styles.label}>Donante:</Text> {item.donante || "Desconocido"}
        </Text>
        <Text style={styles.donacionText}>
          <Text style={styles.label}>Cantidad:</Text> {item.cantidad} litros
        </Text>
        <Text style={styles.donacionText}>
          <Text style={styles.label}>Fecha:</Text> {new Date(item.fecha).toLocaleDateString()}
        </Text>
        <Text style={styles.donacionText}>
          <Text style={styles.label}>Centro de Donación:</Text> {centrosMap[item.centroDonacion] || "Centro desconocido"}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="pencil-outline" size={24} color="#005e72" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#e90101" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerhed}>
        <Header />
      </View>
      <View style={styles.container}>
        <FlatList
          data={donaciones}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Historial")}>
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerfot}>
        <Footer />
      </View>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Donación</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Cantidad"
                value={editingDonation?.cantidad?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) => {
                    if (text === "" || !isNaN(text)) {
                    setEditingDonation({ ...editingDonation, cantidad: text === "" ? "" : parseInt(text) });
                    } else {
                    Alert.alert("Error", "Por favor ingresa solo números.");
                    }
                }}
            />


            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>
                {editingDonation?.fecha ? new Date(editingDonation.fecha).toLocaleDateString() : "Seleccionar fecha"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(editingDonation?.fecha || Date.now())}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEditingDonation({ ...editingDonation, fecha: selectedDate.toISOString() });
                  }
                }}
              />
            )}
            <Picker
              selectedValue={editingDonation?.centroDonacion}
              onValueChange={(value) => setEditingDonation({ ...editingDonation, centroDonacion: value })}
              style={styles.picker}
            >
              {Object.keys(centrosMap).map((centroId) => (
                <Picker.Item key={centroId} label={centrosMap[centroId]} value={centroId} />
              ))}
            </Picker>
            <Button  title="Guardar" color="#004D40" onPress={handleSaveEdit} />
            <Button title="Cancelar" color="#C70039" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginTop:5,
  },
  submitButton: {
    flex: 0.48,
    backgroundColor: '#004D40',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Espacio adicional para evitar que el botón flotante cubra los elementos
  },
  containerfot: {
    flex: 0.2,
  },
  containerhed: {
    flex: 0.3,
  },
  donacionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  donacionInfo: {
    flex: 1,
  },
  donacionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#005e72",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#e90101",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#005e72",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});

export default HistorialDonaciones;
