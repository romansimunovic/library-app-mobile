import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookHomeScreen from '../screens/BookHomeScreen';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator();

/**
 * Root navigator for the book app.
 * Defines all main screens and navigation options.
 */
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
          options={{ title: 'Book List' }} 
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreen} 
          options={{ title: 'Book Details' }} 
        />
        <Stack.Screen 
          name="BookForm" 
          component={BookFormScreen} 
          options={{ title: 'Add / Edit Book' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
