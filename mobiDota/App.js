import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home.js';
import Proplayers from './screens/Proplayers.js';
import Proteams from './screens/Proteams.js';
import Proteam from './screens/Proteam.js';
import Leagues from './screens/Leagues.js';
import Followed from './screens/Followed.js';
import Search from './screens/Search.js'
import Charts from './screens/Charts.js'



const Stack = createNativeStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: '#000020',
    card: '#000020',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
export default function App() {

  return (
    
      <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#fff', // Set your desired header color here
          },
          headerTintColor: '#00001F'
          }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Proplayers" component={Proplayers} />
        <Stack.Screen name="Proteams" component={Proteams} />
        <Stack.Screen name="Proteam" component={Proteam} />
        <Stack.Screen name="Leagues" component={Leagues} />
        <Stack.Screen name="Followed" component={Followed} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Charts" component={Charts} />
      </Stack.Navigator>
    </NavigationContainer>

    
  );
}
