import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card, ListItem, Avatar, ButtonGroup } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import proteamids from '../predata/proteamids.js';
import { getDataCacheAPI, getFollowedAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import styles from '../styles/styles.js';
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



export default function Followed({ navigation }) {


  const urldatdota = "https://www.datdota.com/teams/"
  const urldotabuff = "https://www.dotabuff.com/esports/teams/"
  const urlstratz = "https://stratz.com/teams/"
  const [followedPlayersData, setFollowedPlayersData] = useState([]);
  const [followedData, setFollowedData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const proTeamIdsAsNmbr = proteamids.map(Number);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState([0, 1]);

  const getData = async () => {
    let cachedTeams = ''
    let caller = ''
    switch (selectedIndex) {
      case 0:
        cachedTeams = 'followedTeams'
        caller = 'followedTeams'
        break;
        case 1:
        cachedTeams = 'followedPlayers'
        caller = 'followedPlayers'
        break;
    }
    try {
      const fetchedData = await getFollowedAPI(cachedTeams, caller);
      console.log("back here")
      setFollowedData(fetchedData);
      setIsLoadingData(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }
  useEffect(() => { getData() }, [selectedIndex]);

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.logo_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
    </ListItem>
  );

  // RETURNED
  const getAPIdata = () => {
    if (isLoadingData) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    if (!followedData) {
      return <Text style={{textAlign:'center'}}>Followed list is empty</Text>
    }
    return <FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={followedData}
      renderItem={renderItem}
    />
  }

  return (
    <View >
       <ButtonGroup
        selectedButtonStyle={{backgroundColor: '#00001F'}}
        buttons={['TEAMS', 'PLAYERS']}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={ styles.button }
      />
      {getAPIdata()}
      </View>
  );
}