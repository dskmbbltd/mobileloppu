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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        // justifyContent: 'space-around',
        paddingLeft: 10,
    }, loading: {
        paddingTop: '100%',

    }
});
//links to dotabuff etc for team
//dropdowns for team members with info. what to include?
export default function Proteam({ navigation, route }) {

    const team = route.params.item;
    const team_id = team.team_id;
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [isLoadingTeamPlayers, setIsLoadingTeamPlayers] = useState(true);
    const [isFollowed, setIsFollowed] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const getData = async () => {
        const url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20notable_players.name%20%2C%0Aavg(kills)%20%22AVG%20Kills%22%2C%0Acount(distinct%20matches.match_id)%20count%2C%0Asum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1)%20winrate%2C%0Aplayers.avatarfull%0A%20%20%0AFROM%20matches%0AJOIN%20match_patch%20using(match_id)%0AJOIN%20leagues%20using(leagueid)%0AJOIN%20player_matches%20using(match_id)%0AJOIN%20players%20using(account_id)%0AJOIN%20heroes%20on%20heroes.id%20%3D%20player_matches.hero_id%0ALEFT%20JOIN%20notable_players%20ON%20notable_players.account_id%20%3D%20player_matches.account_id%0ALEFT%20JOIN%20teams%20using(team_id)%0AWHERE%20TRUE%0AAND%20kills%20IS%20NOT%20NULL%20%0AAND%20(notable_players.team_id%20%3D%20" + team_id + ")%0AGROUP%20BY%20notable_players.name%2Cplayers.avatarfull%0AHAVING%20count(distinct%20matches.match_id)%20%3E%3D%201%0AORDER%20BY%20%22AVG%20Kills%22%20DESC%2Ccount%20DESC%20NULLS%20LAST%0ALIMIT%20200"
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
            if (teams !== null && teams.includes(team_id)) {
                setIsFollowed(true);
            }
            return;
        } catch (e) {
            Alert.alert("Error fetching followed data, function getFollowedTeams", e);
        }
    }
    useEffect(() => { getFollowedTeams() }, []);

    //ACCORDION HANDLING idea modified from https://mui.com/material-ui/react-accordion/
    const handleExpand = (key) => {
        setExpanded(expanded === key ? false : key);
    };

    const getAPIdata = () => {
        if (isLoadingTeamPlayers) {
            return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        } if (teamPlayers.length === 0) {
            return <Text>No player data for this team available.</Text>
        } else return (teamPlayers.map((player, key) => {
             return (
                <ListItem.Accordion key={key} bottomDivider
                    content={
                        <ListItem.Content >
                            <Avatar source={{ uri: player.avatarfull }} />
                            <ListItem.Title key={key}>{player.name}</ListItem.Title>
                        </ListItem.Content>
                    }
                    isExpanded={expanded === key}
                    onPress={() => handleExpand(key)}
                >
                    <ListItem>
                        <ListItem.Content>
                            <Text>{"Matches: " + player.count}</Text>
                            <Text>{"Win rate: " + Math.round(player.winrate * 100) + "%"}</Text>
                        </ListItem.Content>
                    </ListItem>
                </ListItem.Accordion>
            )
        }))
    }

    const addOrRemove = async (action) => {
        const followed1 = 'followedTeams';
        if (action === 'add') {
            try {
                const teams = await addFollowedData(followed1, team_id);
                setIsFollowed(true);
            } catch (e) {
                Alert.alert("couldnt add to followed list", e);
            }
        }
        if (action === 'remove') {
            try {
                const teams = await removeFollowedData(followed1, team_id);
                setIsFollowed(false);
            } catch (e) {
                Alert.alert("couldnt add to followed list", e);
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
            <Text style={{ textAlign: 'center' }}>{'Rating: ' + team.rating}
            </Text>
            {followedButton()}
            {getAPIdata()}
        </Card>
    )
}