// import { StatusBar } from 'expo-status-bar';
// import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home.js';
import Proteams from './screens/Proteams.js';
import Proteam from './screens/Proteam.js';
import Leagues from './screens/Leagues.js';
import Followed from './screens/Followed.js';
import Search from './screens/Search.js'
import Charts from './screens/Charts.js'
import { Octicons } from '@expo/vector-icons';
import HeroStats from './screens/HeroStats.js';
import Proplayer from './screens/Proplayer.js';
import GraphsHome from './screens/GraphsHome.js';

const Stack = createNativeStackNavigator();
const ProStack = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#00001F'
    }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Proplayer" component={Proplayer} />
      <Stack.Screen name="Proteams" component={Proteams} />
      <Stack.Screen name="Proteam" component={Proteam} />
      <Stack.Screen name="Leagues" component={Leagues} />
      <Stack.Screen name="Followed" component={Followed} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}
const StatsStack = ({ navigation }) => {
  return (<Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#00001F'
    }}
  >
    <Stack.Screen name="Graphs Home" component={GraphsHome} />
    <Stack.Screen name="Heroes" component={HeroStats} />
    <Stack.Screen name="Charts" component={Charts} />
  </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Pros') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Graphs') {
            iconName = focused ? 'pulse' : 'pulse';
          }
          return <Octicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Pro Dota',
        }}
        name='Pros' component={ProStack} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Graphs & Data',
        }}
        name='Graphs' component={StatsStack} />
    </Tab.Navigator>
  )
}
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: '#000020',
    activeTintColor: 'blue',
    inactivetintcolor: 'green',
    card: '#000020',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
export default function App() {

  return (
    
      <NavigationContainer theme={MyTheme}>
        <TabNavigator/>
    </NavigationContainer>

  );
}
