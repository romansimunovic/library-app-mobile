import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookHomeScreen from '../screens/BookHomeScreen'; // naš Home screen
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BookHome"> 
        <Stack.Screen 
          name="BookHome" 
          component={BookHomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="BookList" 
          component={BookListScreen} 
          options={{ title: 'Lista knjiga' }} 
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreen} 
          options={{ title: 'Detalji knjige' }} 
        />
        <Stack.Screen 
          name="BookForm" 
          component={BookFormScreen} 
          options={{ title: 'Dodaj / Uredi knjigu' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
