// https://api.opendota.com/api/leagues/16483/teams
// https://api.opendota.com/api/leagues/16483/

import { useEffect, useState } from "react";
import proleagueids from "../predata/proleagueids";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListItem } from "@rneui/base";
import { Avatar } from "@rneui/base/dist/Avatar/Avatar";
import { getDataCacheAPI, getFollowedAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import styles from "../styles/styles.js";

// leagues should have dropdowns for participating teams with links to Proteam screen
export default function Leagues({ navigation }) {
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const [leaguesData, setLeaguesData] = useState([]);

  const getData = async () => {
    const url = "https://api.opendota.com/api/leagues"
    const cachedLeagues = 'cachedLeagues'
    const caller = 'leagues'
    try {
      const fetchedData = await getDataCacheAPI(url, cachedLeagues, 600000, caller);
      console.log("back here")
      console.log(fetchedData)
      setLeaguesData(fetchedData);
      setIsLoadingLeagues(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }

  useEffect(() => { getData() }, []);

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem containerStyle={styles.list}
    bottomDivider>
      <ListItem.Content>
        <ListItem.Title style={{color: 'white'}}>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={{color: 'white'}}>League tier: {item.tier}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
    </ListItem>
  );
  const getAPIdata = () => {
    if (isLoadingLeagues) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    return <FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={leaguesData}
      renderItem={renderItem}
    />
  }

  return (
    <View>{getAPIdata()}</View>
  )
}