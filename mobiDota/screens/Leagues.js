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

export default function Leagues({ navigation }) {
const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
const [leaguesData, setLeaguesData] = useState([]);

    const getCachedData = async () => {
        try {
          const cachedLeagues = await AsyncStorage.getItem('cachedLeagues');
          const cachedLeaguesTime = await AsyncStorage.getItem('cachedLeaguesTime');
          const maxStaleTime = 10 * 60 * 1000; // 10min for testing
            if (cachedLeagues && maxStaleTime) {
            const leaguesTime = parseInt(cachedLeaguesTime);
            console.log(leaguesTime)
            if (Date.now() - leaguesTime < maxStaleTime) { // DATA EXISTS, IS FRESH
              console.log("made it here")
                setLeaguesData(JSON.parse(cachedLeagues));
              console.log("loading cached data")
              setIsLoadingLeagues(false);
            } else { // DATA STALE
              console.log("data is stale, fetching")
              await getAllLeagues();
            }
          } else {
            await getAllLeagues(); // NO DATA
          }
        } catch (e) {
          Alert.alert("Error fetching team data:", e)
        }
      };

    const getAllLeagues = async () => {
        const url = "https://api.opendota.com/api/leagues/"

        try {
            const response = await fetch(url);
            console.log("Response status leagues", response.status);
            const leaguesJSON = await response.json();
            let leaguesInProLeaguesList = leaguesJSON.filter(obj => proleagueids.includes(obj.leagueid));
            console.log("trying async")
            await AsyncStorage.setItem('cachedLeagues', JSON.stringify(leaguesInProLeaguesList));
            await AsyncStorage.setItem('cachedLeaguesTime', Date.now().toString());
            setLeaguesData(leaguesInProLeaguesList);
            setIsLoadingLeagues(false);
        } catch (e) {
            Alert.alert("Error fetching league data", e)
        }
    }

    useEffect(() => { getCachedData() }, [])


    keyExtractor = (item, index) => index.toString();
    renderItem = ({ item }) => (
      <ListItem bottomDivider>
        <Avatar source={{ uri: item.logo_url }} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>League tier: {item.tier}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
        {/* <ListItem.Chevron onPress={() => navigation.navigate('Proteam', {item:item, playersData:playersData})}/> */}
      </ListItem>
    );
    const getAPIdata = () => {
        if (isLoadingLeagues) {
          return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        }
        return <FlatList
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          keyExtractor={this.keyExtractor}
          data={leaguesData}
          renderItem={this.renderItem}
        />
      }

return (
    <View>{getAPIdata()}</View>
)
}