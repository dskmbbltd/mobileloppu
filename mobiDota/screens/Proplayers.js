import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Card, ListItem, Avatar } from '@rneui/themed';

export default function Proplayers() {
    // PLAYERS DATA GOES HERE
    const [playersData, setPlayersData] = useState([]); 
// GET PRO PLAYERS DATA
    const getData = async () => {
    const url = "https://api.opendota.com/api/proPlayers"
    try {
        const response = await fetch(url);
        console.log("Response status", response.status);
        const playersJSON = await response.json();
        console.log(playersJSON);
        setPlayersData(playersJSON)
    } catch (e) {
        Alert.alert("Error fetching data")
    }
}
// CALL ON FIRST LOAD
useEffect(() => { getData() }, []);
//

keyExtractor = (item, index) => index.toString();

renderItem = ({ item }) => (
  <ListItem bottomDivider>
    <Avatar source={{uri: item.avatar}} />
    <ListItem.Content>
      <ListItem.Title>{item.name}</ListItem.Title>
      <ListItem.Subtitle>{item.team_name}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
);


return (
    <View><FlatList
    keyExtractor={this.keyExtractor}
    data={playersData}
    renderItem={this.renderItem}
  /></View>
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



