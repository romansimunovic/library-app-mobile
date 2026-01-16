import React from 'react';
import { View, Text, Button } from 'react-native';

export default function BookHomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dobrodošli u Library App!</Text>
      <Button
        title="Pogledaj knjige"
        onPress={() => navigation.navigate('Books')}
      />
    </View>
  );
}
