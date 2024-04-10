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
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import db from './db/db.js'
import { ThemeProvider, createTheme } from '@rneui/themed';

const Stack = createNativeStackNavigator();

export default function App() {

  const [proplayers, setProplayers] = useState([]);
 //run at first render
 useEffect(() => {
  
  db.transaction(tx => {
    tx.executeSql('create table if not exists proplayers (id integer primary key not null, name text, teamid int);');
    }, null, updateList);
}, []);

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from proplayers;', [], (_, { rows }) =>
      setProplayers(rows._array)
    );
  });
}
console.log(proplayers);


  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Proplayers" component={Proplayers} />
        <Stack.Screen name="Proteams" component={Proteams} />
        <Stack.Screen name="Proteam" component={Proteam} />
        <Stack.Screen name="Leagues" component={Leagues} />
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
