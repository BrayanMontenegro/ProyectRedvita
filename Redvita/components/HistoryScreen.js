import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Footer from './Footer';

const HistoryScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistoryScreen;
