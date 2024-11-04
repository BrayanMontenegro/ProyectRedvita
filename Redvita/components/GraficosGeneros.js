import { StyleSheet, View, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";

export default function GraficoGeneros({ dataGeneros }) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <PieChart
        data={dataGeneros}
        width={screenWidth - (screenWidth * 0.1)}
        height={250}
        chartConfig={{
          backgroundColor: "#0000",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#f5f5f5",
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        }}
        accessor={"population"}
        paddingLeft={45}
        backgroundColor={"transparent"}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Suave fondo rojo claro
    borderRadius: 10, // Bordes redondeados // Espacio alrededor del gráfico
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 5 },
   
  },
});
