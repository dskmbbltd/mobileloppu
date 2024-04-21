import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home.js';
import Proplayers from './screens/Proplayers.js';
import Proteams from './screens/Proteams.js';
import Proteam from './screens/Proteam.js';
import Leagues from './screens/Leagues.js';
import Followed from './screens/Followed.js';
import Search from './screens/Search.js'
// import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
// import db from './db/db.js'
import { ThemeProvider, createTheme } from '@rneui/themed';

const Stack = createNativeStackNavigator();

export default function App() {


  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Proplayers" component={Proplayers} />
        <Stack.Screen name="Proteams" component={Proteams} />
        <Stack.Screen name="Proteam" component={Proteam} />
        <Stack.Screen name="Leagues" component={Leagues} />
        <Stack.Screen name="Followed" component={Followed} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
