import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookListScreen from '../screens/BookListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Books" component={BookListScreen} />
    </Tab.Navigator>
  );
}
