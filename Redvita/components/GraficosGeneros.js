import { StyleSheet, View, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";

export default function GraficoGeneros({ dataGeneros }) {

  let screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <PieChart
        data={dataGeneros}
        width={screenWidth - (screenWidth * 0.1)}
        height={300}
        chartConfig={{
          backgroundColor: "#FF4444",  // Color de fondo (no afecta los cuadrados)
          backgroundGradientFrom: "#f0f0f0",  // Color inicial del gradiente
          backgroundGradientTo: "#f0f0f0",    // Color final del gradiente
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,  // Cambia los cuadrados del gráfico
        }}
        accessor={"population"}
        paddingLeft={45}
        backgroundColor={"transparent"}
        style={{
          borderRadius: 10
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
});
