import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import db from '../db/db.js';
import { Button } from '@rneui/themed';
import { Card, ListItem, Avatar } from '@rneui/themed';

export default function Proteam({navigation, route}) {
    //change to use https://api.opendota.com/api/teams/{team_id}/players for playerdata instead!
    const team = route.params.item;
    const playersData = route.params.playersData;
    console.log(playersData)
    const teamPlayers = playersData.filter(player => player.team_id === team.team_id);

    console.log(teamPlayers);
    return(
        <Card>
            <Card.Title>{team.name}</Card.Title>
            {teamPlayers.map((player, key) => {
                return (
                    <ListItem bottomDivider>
      <Avatar source={{ uri: player.avatar }} />
      <ListItem.Content></ListItem.Content>
                    <ListItem.Title key={key}>{player.name}</ListItem.Title>
                </ListItem>
                )
            })}
        </Card>
    )

    
}