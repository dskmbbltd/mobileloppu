import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native';
import { Button, Card, ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { getDataCacheAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/styles.js';

export default function Proteam({ navigation, route }) {
    const team = route.params.item;

    const urldatdota = "https://www.datdota.com/teams/"
    const urldotabuff = "https://www.dotabuff.com/esports/teams/"
    const urlstratz = "https://stratz.com/teams/"
    const team_id = team.team_id;
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [isLoadingTeamPlayers, setIsLoadingTeamPlayers] = useState(true);
    const [isFollowed, setIsFollowed] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [followedPlayers, setFollowedPlayers] = useState([]);

    const getData = async () => {
        const url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20notable_players.name%20%2C%0Anotable_players.account_id%2C%0Aavg(kills)%20%22AVG%20Kills%22%2C%0Acount(distinct%20matches.match_id)%20count%2C%0Asum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1)%20winrate%2C%0Aplayers.avatarfull%0A%20%20%0AFROM%20matches%0AJOIN%20match_patch%20using(match_id)%0AJOIN%20leagues%20using(leagueid)%0AJOIN%20player_matches%20using(match_id)%0AJOIN%20players%20using(account_id)%0AJOIN%20heroes%20on%20heroes.id%20%3D%20player_matches.hero_id%0ALEFT%20JOIN%20notable_players%20ON%20notable_players.account_id%20%3D%20player_matches.account_id%0ALEFT%20JOIN%20teams%20using(team_id)%0AWHERE%20TRUE%0AAND%20kills%20IS%20NOT%20NULL%20%0AAND%20(notable_players.team_id%20%3D%20" + team_id + ")%0AGROUP%20BY%20notable_players.name%2Cnotable_players.account_id%2Cplayers.avatarfull%0AHAVING%20count(distinct%20matches.match_id)%20%3E%3D%201%0AORDER%20BY%20%22AVG%20Kills%22%20DESC%2Ccount%20DESC%20NULLS%20LAST%0ALIMIT%20200"
        const cachedTeamPlayers = team_id.toString();
        const caller = 'proteam';

        try {
            const fetchedData = await getDataCacheAPI(url, cachedTeamPlayers, 3600000, caller);
            // console.log("back here");
            // console.log(fetchedData);
            setTeamPlayers(fetchedData);
            setIsLoadingTeamPlayers(false);
        } catch (e) {
            Alert.alert("Error fetching data, function: getData", e);
        };
    };
    useEffect(() => { getData() }, []);

    //GET FOLLOWED DATA  
    const getFollowed = async () => {
        const followed = 'followedTeams';
        try {
            const teams = await getFollowedData(followed);
            if (teams !== null && teams.includes(team_id)) {
                setIsFollowed(true);
            }
            const players = await getFollowedData('players');
            setFollowedPlayers(players);
        } catch (e) {
            Alert.alert("Error fetching followed data, function getFollowedTeams", e);
        };
    };
    useEffect(() => { getFollowed() }, []);

    //ACCORDION HANDLING idea modified from https://mui.com/material-ui/react-accordion/
    const handleExpand = (key) => {
        setExpanded(expanded === key ? false : key);
    };

    const getAPIdata = () => {
        if (isLoadingTeamPlayers) {
            return <><ActivityIndicator style={styles.loading} size="large" />
            <Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        } if (teamPlayers.length === 0) { // no team member data
            return <Text style={{marginTop: 15, color: 'white', textAlign:'center'}} >No player data for this team available.</Text>
        } else return (teamPlayers.map((player, key) => {
             return (
                <ListItem.Accordion key={player.account_id} 
                    content={
                        <ListItem.Content style={styles.proteamListItemContentAccordion}>
                            {checkFollowed(player.account_id)}
                            <Avatar source={{ uri: player.avatarfull }} />
                            <ListItem.Title key={player.account_id}>{player.name}</ListItem.Title>
                        </ListItem.Content>
                    }
                    isExpanded={expanded === key}
                    onPress={() => handleExpand(key)}
                >
                    <ListItem >
                        <ListItem.Content style={{flex:1, alignItems:'center'}}>
                            <Text>{"Matches: " + player.count}</Text>
                            <Text>{"Win rate: " + Math.round(player.winrate * 100) + "%"}</Text>
                        </ListItem.Content>
                    </ListItem>
                </ListItem.Accordion>
            );
        }));
    };
    
    const checkFollowed = (accid) => {
        if (followedPlayers.includes(accid)) {
            return (
                <Button
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ["#FF9800", "#F44336"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    onPress={() => addOrRemove('remove', 'players', accid)}
                >
                    Followed
                </Button>
            )};
        return (
            <Button
                ViewComponent={LinearGradient}
                linearGradientProps={{
                    colors: ["#03d7fc", "#028299"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                }}
                onPress={() => addOrRemove('add', 'players', accid)}
            >
                Not Followed
            </Button>
        )};
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
                    onPress={() => addOrRemove('remove', 'teams', team_id)}
                >
                    Team is Followed
                </Button>
            )};
        if (!isFollowed) {
            return (
                <Button
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ["#03d7fc", "#028299"],
                        start: { x: 0, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    onPress={() => addOrRemove('add', 'teams', team_id)}
                >
                    Team Not Followed
                </Button>
            )}};

    //call to asyncstorage for following functionality
const addOrRemove = async (action, caller, datatoAddorRemove) => {
    let followedKey = ''
    if (caller === 'teams') {
        followedKey = 'followedTeams'
    } else {
        followedKey = 'players'
    };
    try {
        if (action === 'add') {
            const data = await addFollowedData(followedKey, datatoAddorRemove);
            if (caller === 'teams') {
                setIsFollowed(true);
            } else {
                setFollowedPlayers(data);
            }
        } else if (action === 'remove') {
            const data = await removeFollowedData(followedKey, datatoAddorRemove);
            if (caller === 'teams') {
                setIsFollowed(false);
            } else {
                setFollowedPlayers(data);
            }
        }
    } catch (error) {
        Alert.alert("Couldn't update followed list", error);
    };
};

    return (
        <Card containerStyle={styles.cardproteam}>
            
            <Card.Title style={{color: 'white'}}>{team.name}</Card.Title>
            <Avatar size={50} containerStyle={{backgroundColor: '#000', alignSelf: 'center'}} source={{ uri: team.logo_url }} />
            <Text style={{color: 'white', textAlign: 'center' }}>{'Rating: ' + team.rating}</Text>
            <View style={{width: '100%', flexDirection: 'row', marginBottom: 2}}>
            <Button title='Dotabuff' containerStyle={{flex: 1}} buttonStyle={styles.extbuttons} onPress={() => {Linking.openURL(urldotabuff+team_id)}}/>
            <Button title='DatDota' containerStyle={{flex: 1}} buttonStyle={styles.extbuttons} onPress={() => {Linking.openURL(urldatdota+team_id)}}/>
            <Button title='Stratz' containerStyle={{flex: 1}} buttonStyle={styles.extbuttons} onPress={() => {Linking.openURL(urlstratz+team_id)}}/>
            </View>
            {followedButton()}
            {getAPIdata()}
        </Card>
    );
};