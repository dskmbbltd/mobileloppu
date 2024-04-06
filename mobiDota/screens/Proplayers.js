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
//TODO
//BROWSE BY TEAM
//SEARCH BY PLAYERNAME OR TEAM
let proteamidsasnmbr = proteamids.map(Number);
useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table proplayers if not exists (id integer primary key not null, name text, teamid integer);');
    // tx.executeSql('create table if not exists shopping (id integer primary key not null, amount text, title text);');
  }, null, updateList);
}, []);

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from proplayers;', [], (_, { rows }) =>
      setPlayersFromDB(rows._array)
    );
  });
}

    // PLAYERS DATA GOES HERE
    const [playersData, setPlayersData] = useState([]); 
    // TEAM DATA GOES HERE
    const [teamsData, setTeamsData] = useState([]); 

// GET PRO PLAYERS DATA
    const getProPlayersData = async () => {
    const url = "https://api.opendota.com/api/proPlayers"
    try {
        const response = await fetch(url);
        console.log("Response status", response.status);
        const playersJSON = await response.json();
        console.log(playersJSON);
        setPlayersData(playersJSON)
    } catch (e) {
        Alert.alert("Error fetching player data")
    }
}
const [proTeamsToShow,setProTeamsToShow] = useState([]);
// GET ALL TEAMS
const getAllTeamsData = async () => {
  const url = "https://api.opendota.com/api/teams"
  try {
      const response = await fetch(url);
      console.log("Response status", response.status);
      const teamsJSON = await response.json();
      let teamInProTeamList = teamsJSON.filter(obj => proteamidsasnmbr.includes(obj.team_id));
      setTeamsData(teamInProTeamList);
  } catch (e) {
      Alert.alert("Error fetching team data")
  }
  }

  

// CALL ON FIRST LOAD
useEffect(() => { getAllTeamsData() }, []);
// useEffect(() => { getProPlayersData() }, []);
//

keyExtractor = (item, index) => index.toString();
renderItem = ({ item }) => (
  <ListItem bottomDivider>
    {/* <Avatar source={{uri: item.avatar}} /> */}
    <ListItem.Content>
      <ListItem.Title>{item.name}</ListItem.Title>
      <ListItem.Subtitle>{item.rating}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
);


return (
    <View><FlatList
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



