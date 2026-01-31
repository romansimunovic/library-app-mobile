import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme/theme';

import BookHomeScreen from '../screens/BookHomeScreen';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookFormScreen from '../screens/BookFormScreen';

const Stack = createNativeStackNavigator();

const RayOfLightTheme = {
  ...DarkTheme, 
  colors: {
    ...DarkTheme.colors,
    background: COLORS.bg,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.ethereal,
  },
}

export default function AppNavigator() {
  return (
   <NavigationContainer theme={RayOfLightTheme}>
      <Stack.Navigator
        initialRouteName="BookHome"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
            elevation: 0, // Remove shadow for flat look
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: '300',
            letterSpacing: 1,
            color: COLORS.text,
          },
          headerTintColor: COLORS.ethereal,
          contentStyle: {
            backgroundColor: COLORS.bg,
          },
        }}
      >
        <Stack.Screen
          name="BookHome"
          component={BookHomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{ title: 'BOOKS' }}
        />

        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: 'DETAILS' }}
        />

        <Stack.Screen
          name="BookForm"
          component={BookFormScreen}
          options={{ title: 'EDIT / ADD' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
