import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Card, ListItem, Avatar } from '@rneui/themed';
import db from '../db/db.js'
import proteamids from '../predata/proteamids.js';

export default function Proplayers() {
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
  // useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql('create table proplayers if not exists (id integer primary key not null, name text, teamid integer);');
  //   }, null, updateList);
  // }, []);

  // const updateList = () => {
  //   db.transaction(tx => {
  //     tx.executeSql('select * from proplayers;', [], (_, { rows }) =>
  //       setPlayersFromDB(rows._array)
  //     );
  //   });
  // }
  
  const urldatdota = "https://www.datdota.com/teams/"
  const urldotabuff = "https://www.dotabuff.com/esports/teams/"
  const urlstratz = "https://stratz.com/teams/"

  //TODO
  //SEARCH BY PLAYERNAME OR TEAM
  let proTeamIdsAsNmbr = proteamids.map(Number);


  // PLAYERS DATA GOES HERE
  const [playersData, setPlayersData] = useState([]);
  // TEAM DATA GOES HERE
  // TEAM DATA TO BE RENDERED HERE
  const [teamsData, setTeamsData] = useState([]);

  // GET PRO PLAYERS DATA
  const getProPlayersData = async () => {
    const url = "https://api.opendota.com/api/proPlayers"
    try {
      const response = await fetch(url);
      console.log("Response status", response.status);
      const playersJSON = await response.json();
      setPlayersData(playersJSON)
    } catch (e) {
      Alert.alert("Error fetching player data")
    }
  }

  

  // GET ALL TEAMS
  const getAllTeamsData = async () => {
    const url = "https://api.opendota.com/api/teams"

    try {
      const response = await fetch(url);
      console.log("Response status", response.status);
      const teamsJSON = await response.json();
      // only set data for team id found in ../predata/proteamids.js
      let teamInProTeamList = teamsJSON.filter(obj => proTeamIdsAsNmbr.includes(obj.team_id));
      setTeamsData(teamInProTeamList);

    } catch (e) {
      Alert.alert("Error fetching team data")
    }
    // }
  }



  // CALL ON FIRST LOAD
  useEffect(() => { getAllTeamsData() }, []);
  // useEffect(() => { getProPlayersData() }, []);
  

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.logo_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );


  return (
    <View><FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={this.keyExtractor}
      data={teamsData}
      renderItem={this.renderItem}
    /></View>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}



