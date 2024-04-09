import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import db from '../db/db.js';
import { Button } from '@rneui/themed';
import { Card, ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
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
export default function Proteam({ navigation, route }) {
    //change to use https://api.opendota.com/api/teams/{team_id}/players for playerdata instead!
    const team = route.params.item;
    console.log(team)
    const team_id = team.team_id;
    console.log(team_id)
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [isLoadingTeamPlayers, setIsLoadingTeamPlayers] = useState(true)
    const getTeamPlayers = async () => {
        
        
        const url = "https://api.opendota.com/api/teams/"+team_id+"/players"
        console.log(url)
        try {
            const response = await fetch(url);
            console.log("Response status", response.status);
            const teamsJSON = await response.json();
            // save to cache
            //   await AsyncStorage.setItem('cachedTeams', JSON.stringify(teamsInProTeamList));
            //   await AsyncStorage.setItem('cachedTeamsTime', Date.now().toString());
            // use states for shown data
            setTeamPlayers(teamsJSON);
            setIsLoadingTeamPlayers(false);
            console.log("data from API call")
        } catch (e) {
            Alert.alert("Error fetching team data:", e)
        }
    }
    useEffect(() => { getTeamPlayers() }, []);
    const getAPIdata = () => {
        if (isLoadingTeamPlayers) {
            return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        } else return (teamPlayers.map((player, key) => {
            if (player.is_current_team_member) {return (    
            <ListItem bottomDivider>
                <Avatar source={{ uri: player.avatar }} />
                <ListItem.Content></ListItem.Content>
                <ListItem.Title key={key}>{player.name}</ListItem.Title>
            </ListItem>
        )}}))
    }
    

    // const playersData = route.params.playersData;
    // console.log(playersData)
    // const teamPlayers = playersData.filter(player => player.team_id === team.team_id);

    // console.log(teamPlayers);
    return (
        <Card>
            <Card.Title>{team.name}</Card.Title>
            {getAPIdata()}
        </Card>
    )


}