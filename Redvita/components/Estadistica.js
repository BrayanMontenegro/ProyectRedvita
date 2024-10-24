import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import GraficoTiposSangre from './GraficosTipodesangre';
import GraficoGeneros from './GraficosGeneros';
import Footer from './Footer';
import { collection, getDocs, query } from 'firebase/firestore';


//Importación de conexión a firebase
import { db } from '../firebaseConfig';

export default function Estadisticas() {

  const [bandera, setBandera] = useState(false); // Variable bandera
  const [dataGeneros, setDataGeneros] = useState([]);
  const [dataProgreso, setDataProgreso] = useState({
    labels: [''],
    data: [0]
  });
  const [dataTiposSangre, setDataTiposSangre] = useState({
    labels: [],
    datasets: [{ data: [] }] // Inicializa datasets como un array con un objeto
  });

  useEffect(() => {
    const recibirDatosGeneros = async () => {
      try {
        const q = query(collection(db, "usuario_donante"));
        const querySnapshot = await getDocs(q);
        let masculino = 0;
        let femenino = 0;

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { genero } = datosBD;

          if (genero === "Masculino") {
            masculino += 1; // Suma para Masculino
          } else if (genero === "Femenino") {
            femenino += 1; // Suma para Femenino
          }
        });

        // Formatear datos para el gráfico de pastel
        const totalData = [
          {
            name: "Masculino",
            population: masculino,
            color: "rgba(131, 167, 234, 0.5)",  // Azul con 50% de intensidad
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          },
          {
            name: "Femenino",
            population: femenino,
            color: "rgba(255, 105, 180, 0.5)",  // Rosa con 50% de intensidad
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
          }
        ];

        totalPersonas = masculino + femenino;

        const progresos = [masculino/totalPersonas, femenino/totalPersonas]

        setDataProgreso({
          labels: ['Hombres', 'Mujeres'],
          data: progresos
        });

        setDataGeneros(totalData);
        console.log(totalData);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosGeneros();
  }, [bandera]);

  // Carga de datos de tipos de sangre
  useEffect(() => {
    const recibirDatosTiposSangre = async () => {
      try {
        const q = query(collection(db, "usuario_donante"));
        const querySnapshot = await getDocs(q);

        // Inicializa el conteo de tipos de sangre con todos los tipos posibles
        const conteoTiposSangre = {
          "A+": 0,
          "A-": 0,
          "B+": 0,
          "B-": 0,
          "AB+": 0,
          "AB-": 0,
          "O+": 0,
          "O-": 0
        };

        // Realiza el conteo de cada tipo de sangre
        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { tipoSangre } = datosBD;

          if (tipoSangre && conteoTiposSangre.hasOwnProperty(tipoSangre)) {
            // Incrementa el conteo del tipo de sangre
            conteoTiposSangre[tipoSangre] += 1;
          }
        });

        // Genera las etiquetas y datos a partir del conteo
        const labels = Object.keys(conteoTiposSangre);
        const dataCounts = Object.values(conteoTiposSangre);

        // Actualiza el estado con el formato requerido
        setDataTiposSangre({
          labels,
          datasets: [{ data: dataCounts }]
        });

        console.log({ labels, datasets: [{ data: dataCounts }] });
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosTiposSangre();
  }, [bandera]);

  
  //Llamado de componentes
  return (
    <View style={styles.container} >

        <GraficoTiposSangre dataTiposSangre={dataTiposSangre}/>
        <GraficoGeneros dataGeneros={dataGeneros}/>

        <Footer/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
  },
  graphContainer: {
    marginTop: 10,
    padding: 10,
  },
});