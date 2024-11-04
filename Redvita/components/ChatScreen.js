import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Consultar</Text>
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

export default ChatScreen;
