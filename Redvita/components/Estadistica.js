import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView,Text } from 'react-native';
import GraficoTiposSangre from './GraficosTipodesangre';
import GraficoGeneros from './GraficosGeneros';
import GraficoDonaciones from './GraficoHistorialDonaciones';
import Footer from './Footer';
import Header from "./Header";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function Estadisticas() {
  const [dataGeneros, setDataGeneros] = useState([]);
  const [dataProgreso, setDataProgreso] = useState({
    labels: [''],
    data: [0]
  }); 
  const [dataTiposSangre, setDataTiposSangre] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [dataDonaciones, setDataDonaciones] = useState([]);

  useEffect(() => {
    const recibirDatosGeneros = async () => {
      try {
        const q = query(collection(db, "usuario_donante"));
        const querySnapshot = await getDocs(q);
        let masculino = 0;
        let femenino = 0;

        querySnapshot.forEach((doc) => {
          const { genero } = doc.data();
          if (genero === "Masculino") masculino += 1;
          if (genero === "Femenino") femenino += 1;
        });

        const totalData = [
          {
            name: "Masculino",
            population: masculino,
            color: "#00008B",
            legendFontColor: "#00008B",
            legendFontSize: 10
          },
          {
            name: "Femenino",
            population: femenino,
            color: "#C70039",
            legendFontColor: "#C70039",
            legendFontSize: 10
          }
        ];

        const totalPersonas = masculino + femenino;
        const progresos = [masculino / totalPersonas, femenino / totalPersonas];

        setDataProgreso({
          labels: ['Hombres', 'Mujeres'],
          data: progresos
        });

        setDataGeneros(totalData);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosGeneros();
  }, []);

  useEffect(() => {
    const recibirDatosTiposSangre = async () => {
      try {
        const q = query(collection(db, "usuario_donante"));
        const querySnapshot = await getDocs(q);
        const conteoTiposSangre = {
          "A+": 0, "A-": 0, "B+": 0, "B-": 0,
          "AB+": 0, "AB-": 0, "O+": 0, "O-": 0
        };

        querySnapshot.forEach((doc) => {
          const { tipoSangre } = doc.data();
          if (tipoSangre && conteoTiposSangre.hasOwnProperty(tipoSangre)) {
            conteoTiposSangre[tipoSangre] += 1;
          }
        });

        const labels = Object.keys(conteoTiposSangre);
        const dataCounts = Object.values(conteoTiposSangre);

        setDataTiposSangre({
          labels,
          datasets: [{ data: dataCounts }]
        });
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosTiposSangre();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const recibirDatosDonaciones = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const userId = user.uid;
            const q = query(
              collection(db, "historial_donaciones"),
              where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const donaciones = [];

            querySnapshot.forEach((doc) => {
              const { fecha, cantidad } = doc.data();
              donaciones.push({ date: fecha, count: cantidad });
            });

            setDataDonaciones(donaciones);
          } else {
            console.log("Usuario no autenticado");
          }
        } catch (error) {
          console.error("Error al obtener documentos: ", error);
        }
      };

      recibirDatosDonaciones();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerhed}>
        <Header />
      </View>
      <View style={styles.container1}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <GraficoGeneros dataGeneros={dataGeneros} />
          <GraficoDonaciones dataDonaciones={dataDonaciones} />
          <GraficoTiposSangre dataTiposSangre={dataTiposSangre} />
        </ScrollView>
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
  container1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  containerfot:{
    flex:0.1,
  },
  containerhed:{
    flex:0.2, 
  },
});
