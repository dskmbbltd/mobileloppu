
import { ActivityIndicator, Alert, FlatList,Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { ListItem, Avatar } from '@rneui/themed';

import styles from '../styles/styles.js';
import {getDataCacheAPI} from '../predata/apidatafunctions.js'

//SEARCH BY PLAYERNAME OR TEAM
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


export default function Proteams({ navigation }) {
  const [teamsData, setTeamsData] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);

  const getData = async () => {
    const url = "https://api.opendota.com/api/explorer?sql=SELECT%20teams.name%2C%20teams.logo_url%2C%0Ateam_rating.rating%2C%20teams.team_id%0A%0AFROM%20teams%0AJOIN%20team_rating%20using(team_id)%0AORDER%20BY%20team_rating.rating%20DESC%0ALIMIT%20100";
    const cachedTeams = 'cachedTeams';
    const caller = 'proteams';
    try {
      const fetchedData = await getDataCacheAPI(url, cachedTeams, 3600000, caller); //1hour
      setTeamsData(fetchedData);
      setIsLoadingTeam(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e);
    };
  };
  useEffect(() => { getData() }, []);

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem bottomDivider
    containerStyle={styles.list}>
      <Avatar source={{ uri: item.logo_url }} />
      <ListItem.Content >
        <ListItem.Title style={{color: 'white'}}>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={{color: 'white'}}>{"Rating: "+item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
    </ListItem>
  );

  // RETURNED
  const getAPIdata = () => {
    if (isLoadingTeam) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    };
    return <FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={teamsData}
      renderItem={renderItem}
    />
  };

  return (
    <View >{getAPIdata()}</View>
  );
};