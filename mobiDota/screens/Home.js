import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import db from '../db/db.js'
import { Button } from '@rneui/themed'

export default function Home({ navigation }) {
  // will have buttons of main comps?
  const navigateButtons = [{
    title: 'Pro teams',
    navigate: 'Proteams'},
    {
      title: 'Pro players',
    navigate: 'Proplayers'},
    {
      title: 'Leagues',
    navigate: 'Leagues'}
    ];

  return (
    <View style={styles.container}>
      <Text>Application for viewing pro dota information.</Text>
      <Text>Relying on opendota API.</Text>
      {navigateButtons.map((screen, key) => {
        return (
          <Button buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
        title={screen.title}
        onPress={() => navigation.navigate(screen.navigate)}
      />
        )
      })}
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