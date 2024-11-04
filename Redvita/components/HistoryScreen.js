import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Header from './Header';
import Footer from './Footer';

function HistorialDonacionesFormulario() {
  const [formData, setFormData] = useState({
    donante: '',
    cantidad: '',
    fecha: new Date(),
    descripcion: '',
    centroDonacion: '',
  });
  const [centrosDonacion, setCentrosDonacion] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        // Buscar el documento del usuario en la colección usuario_donante
        const q = query(collection(db, 'usuario_donante'), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setFormData((prevData) => ({
            ...prevData,
            donante: `${userData.nombres} ${userData.apellidos}`, // Guardar nombre y apellido en lugar del correo
          }));
        } else {
          console.error('No se encontraron datos del usuario');
          Alert.alert('Error', 'No se encontraron datos del usuario.');
        }
      }
    };

    const fetchCentrosDonacion = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'centros_donacion'));
        const centros = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCentrosDonacion(centros);
      } catch (error) {
        console.error('Error al obtener los centros de donación:', error);
      }
    };

    getCurrentUser();
    fetchCentrosDonacion();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData,
        fecha: selectedDate,
      }));
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await addDoc(collection(db, 'historial_donaciones'), {
        ...formData,
        fecha: formData.fecha.toISOString(),
        userId: auth.currentUser ? auth.currentUser.uid : null,
      });
      Alert.alert('Éxito', 'Donación registrada correctamente');
      setFormData({ ...formData, cantidad: '', descripcion: '', centroDonacion: '' });
    } catch (error) {
      console.error('Error al registrar la donación:', error);
      Alert.alert('Error', 'Error al registrar la donación');
    }
  };

  // Función para validar campos vacíos
  const validateForm = () => {
    if (!formData.donante) {
      Alert.alert('Error', 'El nombre de usuario es obligatorio.');
      return false;
    }
    if (!formData.cantidad) {
      Alert.alert('Error', 'La cantidad donada es obligatoria.');
      return false;
    }
    if (!formData.descripcion) {
      Alert.alert('Error', 'La descripción de la donación es obligatoria.');
      return false;
    }
    if (!formData.centroDonacion) {
      Alert.alert('Error', 'Debe seleccionar un centro de donación.');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerhed}>
        <Header />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Registro de Donación</Text>

        <TextInput
          style={styles.input}
          value={formData.donante}
          placeholder="Nombre de usuario"
          editable={false}
        />

        <TextInput
          style={styles.input}
          value={formData.cantidad}
          onChangeText={(value) => handleChange('cantidad', value)}
          placeholder="Cantidad donada"
          keyboardType="numeric"
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>Seleccionar fecha</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.fecha}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.dateText}>{formData.fecha.toLocaleDateString()}</Text>

        <TextInput
          style={styles.input}
          value={formData.descripcion}
          onChangeText={(value) => handleChange('descripcion', value)}
          placeholder="Descripción de la donación"
          multiline
        />

        <Picker
          selectedValue={formData.centroDonacion}
          onValueChange={(itemValue) => handleChange('centroDonacion', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un centro de donación" value="" />
          {centrosDonacion.map((centro) => (
            <Picker.Item key={centro.id} label={centro.nombre} value={centro.id} />
          ))}
        </Picker>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={() => setFormData({ ...formData, cantidad: '', descripcion: '', centroDonacion: '' })}>
            <Text style={styles.clearButtonText}>Vaciar Campos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerfot}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  containerfot: {
    flex: 0.2,
  },
  containerhed: {
    flex: 0.3,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  dateButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 0.48,
    backgroundColor: '#C70039',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    flex: 0.48,
    backgroundColor: '#004D40',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HistorialDonacionesFormulario;
