import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator();

export default function BooksStack() {
  return (
    <Stack.Navigator initialRouteName="BookList">
      <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Knjige' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalji knjige' }} />
      <Stack.Screen name="BookForm" component={BookFormScreen} options={{ title: 'Uredi / Dodaj knjigu' }} />
    </Stack.Navigator>
  );
}
