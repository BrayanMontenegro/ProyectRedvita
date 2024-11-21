import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Alert, Button } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function GraficoDonaciones({ dataDonaciones }) {
  const screenWidth = Dimensions.get('window').width;
  const squareSize = 30;
  const numDays = 365;

  // Función para personalizar las etiquetas de los meses en el gráfico
  const getMonthLabel = (monthIndex) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthIndex];
  };

  // Función que maneja el evento de presionar un cuadrado en el gráfico (un día específico)
  const handleDayPress = (day) => {
    Alert.alert(`Donaciones`, `Fecha: ${day.date}\nCantidad: ${day.count}`);
  };

  // Función para generar el PDF
  const generarPDF = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Reporte de Donaciones', 10, 10);

      let yPosition = 20;

      if (dataDonaciones.length > 0) {
        dataDonaciones.forEach((donacion, index) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${index + 1}. Fecha: ${new Date(donacion.date).toLocaleDateString()}`, 10, yPosition);
          doc.text(`   Cantidad: ${donacion.count}`, 10, yPosition + 10);
          yPosition += 20;
        });
      } else {
        doc.text('No hay donaciones registradas.', 10, yPosition);
      }

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_donaciones.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error al generar o compartir el PDF: ', error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gráfico de Fechas Donadas 📈📉</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <ContributionGraph
          values={dataDonaciones}
          endDate={new Date("2024-12-30")}
          numDays={numDays}
          width={1680}
          height={300}
          chartConfig={{
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            backgroundGradientFrom: "#00008B",
            backgroundGradientTo: "#C70039",
            color: (opacity = 1) => `rgba(250, 250, 250, ${opacity})`, // color rojo para reflejar donaciones
            strokeWidth: 2,
          }}
          gutterSize={0.4}
          bgColor={"transparent"}
          squareSize={squareSize}
          getMonthLabel={getMonthLabel}
          onDayPress={handleDayPress}
          style={{
            borderRadius: 10,
          }}
        />
      </ScrollView>
      <Button title="Generar PDF de Donaciones" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#005e72",
  },
});
