import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Card, ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { getDataCacheAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import { LinearGradient } from 'expo-linear-gradient';

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
    const [isFollowed, setIsFollowed] = useState(null);

    //GET PLAYER DATA
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
            Alert.alert("Error fetching data, function: getData", e)
        }
    }
    useEffect(() => { getData() }, []);

    //GET FOLLOWED DATA  
    const getFollowedTeams = async () => {
        const followed = 'followedTeams';
        try {
            const teams = await getFollowedData(followed);
            if (teams !== null && teams.includes(team_id)){
                setIsFollowed(true);
            }
            return;
        } catch (e) {
            Alert.alert("Error fetching followed data, function getFollowedTeams", e);
        }
    }
    useEffect(() => { getFollowedTeams() }, []);

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

    const addOrRemove = async (action) => {
        const followed1 = 'followedTeams';
        if (action === 'add') {
            try {
                const teams = await addFollowedData(followed1, team_id);
                setIsFollowed(true);
            } catch (e) {
                Alert.alert("couldnt add to followed list",e);
            }
        }
            if (action === 'remove') {
                try {
                    const teams = await removeFollowedData(followed1, team_id);
                    setIsFollowed(false);
                } catch (e) {
                    Alert.alert("couldnt add to followed list",e);
                }
        }
    }

    const followedButton = () => {
        if (isFollowed) {
            return (
            <Button
                ViewComponent={LinearGradient}
                linearGradientProps={{
                    colors: ["#FF9800", "#F44336"],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 },
                }}
                onPress={() => addOrRemove('remove')}
            >
                Team is Followed
            </Button>
            )
        }
            if (!isFollowed) {
                return (
                <Button
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ["#03d7fc", "#028299"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    onPress={() => addOrRemove('add')}
                >
                    Team Not Followed
                </Button>
                )
            }        
        }
    

    return (
        <Card>
            <Card.Title>{team.name}</Card.Title>
            {followedButton()}
            {getAPIdata()}
        </Card>
    )


}