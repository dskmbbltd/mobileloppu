import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import db from '../db/db.js'
import { Button } from '@rneui/themed'

export default function Home({ navigation }) {
  // will have buttons of main comps?
  return (
    <View style={styles.container}>
      <Text>Application for viewing pro dota information</Text>
      <Button buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
        title="Pro Teams"
        onPress={() => navigation.navigate('Proteams')}
      />
      <Button 
        title="Pro Players"
        buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
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