import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Home({ navigation }) {
  // will have buttons of main comps?
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button style={styles.button}
        title="Go to Details"
        onPress={() => navigation.navigate('Proplayers')}
      />
    </View>
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