import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Card, ListItem, Avatar } from '@rneui/themed';
import proteamids from '../predata/proteamids.js';

export default function Proplayer({ navigation, route }) {
  const player = route.params.item;
  const [playerData, setPlayerData] = useState();
  console.log(player)
  const getData = async () => {
    const url = "https://api.opendota.com/api/players/"+player.account_id
    const cache = player.account_id.toString();
    const caller = 'proplayer';
    console.log(url);

    try {
        const fetchedData = await getDataCacheAPI(url, cache, 600000, caller);
        console.log("back here");
        console.log(fetchedData);
        setTeamPlayers(fetchedData);
        setIsLoadingTeamPlayers(false);
    } catch (e) {
        Alert.alert("Error fetching data, function: getData", e);
    };
};
// useEffect(() => { getData() }, []);

  return (
    <View style={styles.container}
    ><Text style={{ color: '#fff' }}>test</Text>
    </View>
  );
}



