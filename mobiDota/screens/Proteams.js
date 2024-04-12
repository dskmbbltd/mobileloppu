import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card, ListItem, Avatar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db.js'
import proteamids from '../predata/proteamids.js';
import getDataCacheAPI from '../predata/apidatafunctions.js'
//TODO

//SEARCH BY PLAYERNAME OR TEAM
//esim data
// {
//   "team_id": 9247354,
//   "rating": 1684.72,
//   "wins": 109,
//   "losses": 36,
//   "last_match_time": 1712510221,
//   "name": "Team Falcons",
//   "tag": "FLCN",
//   "logo_url": "https://steamusercontent-a.akamaihd.net/ugc/2314350571781870059/2B5C9FE9BA0A2DC303A13261444532AA08352843/"
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  }, loading: {
    paddingTop: '100%',

  }
});

export default function Proplayers({ navigation }) {


  const urldatdota = "https://www.datdota.com/teams/"
  const urldotabuff = "https://www.dotabuff.com/esports/teams/"
  const urlstratz = "https://stratz.com/teams/"
  const [playersData, setPlayersData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const proTeamIdsAsNmbr = proteamids.map(Number);

  const getData = async () => {
    const url = "https://api.opendota.com/api/teams"
    const cachedTeams = 'cachedTeams'
    const caller = 'proteams'
    try {
      const fetchedData = await getDataCacheAPI(url, cachedTeams, 0, caller);
      console.log("back here")
      setTeamsData(fetchedData);
      setIsLoadingTeam(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }
  useEffect(() => { getData() }, []);

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.logo_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
      {/* <ListItem.Chevron onPress={() => navigation.navigate('Proteam', {item:item, playersData:playersData})}/> */}
    </ListItem>
  );

  // RETURNED
  const getAPIdata = () => {
    if (isLoadingTeam) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    return <FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={this.keyExtractor}
      data={teamsData}
      renderItem={this.renderItem}
    />
  }

  return (
    <View >{getAPIdata()}</View>
  );
}