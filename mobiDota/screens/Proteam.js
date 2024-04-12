import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import db from '../db/db.js';
import { Button } from '@rneui/themed';
import { Card, ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
import getDataCacheAPI from '../predata/apidatafunctions.js';

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

    const team = route.params.item;
    const team_id = team.team_id;
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [isLoadingTeamPlayers, setIsLoadingTeamPlayers] = useState(true);

    const getData = async () => {
        const url = "https://api.opendota.com/api/teams/" + team_id + "/players";
        const cachedTeamPlayers = team_id.toString();
        const caller = 'proteam'
        console.log(url)
        console.log(cachedTeamPlayers)
        try {
        const fetchedData = await getDataCacheAPI(url, cachedTeamPlayers, 600000, caller);
        console.log("back here")
        console.log(fetchedData)
        setTeamPlayers(fetchedData);
        setIsLoadingTeamPlayers(false);
        } catch (e) {
          Alert.alert("Error fetching data, function: getData",e)
        }
      }
      useEffect(() => { getData() }, []);


    const getAPIdata = () => {
        if (isLoadingTeamPlayers) {
            return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        } else return (teamPlayers.map((player, key) => {
            if (player.is_current_team_member) {
                return (
                    <ListItem key={key} bottomDivider>
                        <Avatar source={{ uri: player.avatar }} />
                        <ListItem.Content></ListItem.Content>
                        <ListItem.Title key={key}>{player.name}</ListItem.Title>
                    </ListItem>
                )
            }
        }))
    }


    return (
        <Card>
            <Card.Title>{team.name}</Card.Title>
            {getAPIdata()}
        </Card>
    )


}