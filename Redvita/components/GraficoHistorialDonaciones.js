import { StyleSheet, View, Dimensions, ScrollView, Alert } from 'react-native';
import { ContributionGraph } from "react-native-chart-kit";

export default function GraficoDonaciones({ dataDonaciones }) {

  const screenWidth = Dimensions.get("window").width;
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

  return (
    <View style={styles.container}>

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
