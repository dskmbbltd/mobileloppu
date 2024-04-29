// import { StatusBar } from 'expo-status-bar';
import { Alert,  FlatList, Linking, StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Card, ListItem, Avatar,Button } from '@rneui/themed';
import styles from '../styles/styles.js';

export default function Proplayer({ navigation, route }) {
  // const urldatdota = "https://www.datdota.com/players/"
  const urldotabuff = "https://www.dotabuff.com/players/"
  const urlstratz = "https://stratz.com/players/"
  const player = route.params.item;
  const [playerData, setPlayerData] = useState();
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  console.log(player)
  const getData = async () => {
    const url = "https://api.opendota.com/api/players/" + player.account_id
    const cache = player.account_id;
    const caller = 'proplayer';
    console.log(url);

    try {
      const fetchedData = await getDataCacheAPI(url, cache, 0, caller);
      // console.log("back here");
      // console.log(fetchedData);
      setPlayerData(fetchedData);
      setIsLoadingPlayer(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e);
    };
  };
  // useEffect(() => { getData() }, []);

  const getAPIdata = () => {
    if (isLoadingPlayer) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    };
    return <Card containerStyle={styles.cardplayer}>
      <Avatar size={50} containerStyle={{ backgroundColor: '#000', alignSelf: 'center' }} source={{ uri: player.avatarfull }} />
      <Card.Title style={{ color: 'white' }}>{player.personaname}</Card.Title>
      <View style={{ width: '100%', flexDirection: 'row', marginBottom: 2 }}>
        <Button title='Dotabuff' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urldotabuff + team_id) }} />
        <Button title='DatDota' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urldatdota + team_id) }} />
        <Button title='Stratz' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urlstratz + team_id) }} />
      </View>
      <Text style={{ color: '#fff', textAlign: 'center' }}>{"Last match time: " + (player.last_match_time ? player.last_match_time : "No info")}</Text>
    </Card>
  };
  return (
    
      <Card containerStyle={styles.cardplayer}>
      
      <Avatar size={50} containerStyle={{ backgroundColor: '#000', alignSelf: 'center' }} source={{ uri: player.avatarfull }} />
      <Card.Title style={{ color: 'white' }}>{player.personaname || player.name}</Card.Title>
      <View style={{ width: '100%', flexDirection: 'row', marginBottom: 2 }}>
        <Button title='Dotabuff' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urldotabuff + player.account_id) }} />
        {/* <Button title='DatDota' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urldatdota + player.account_id) }} /> */}
        <Button title='Stratz' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urlstratz + player.account_id) }} />
      </View>
      <Text style={{ color: '#fff', textAlign: 'center' }}>{"Last match time: " + (player.last_match_time ? player.last_match_time : "No info")}</Text>
    </Card>
    // {getAPIdata()}
  );
}



