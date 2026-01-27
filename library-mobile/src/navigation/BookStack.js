import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator();

/**
 * Stack navigator for all book-related screens.
 */
export default function BooksStack() {
  return (
    <Stack.Navigator initialRouteName="BookList">
      <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Books' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="BookForm" component={BookFormScreen} options={{ title: 'Add / Edit Book' }} />
    </Stack.Navigator>
  );
}
