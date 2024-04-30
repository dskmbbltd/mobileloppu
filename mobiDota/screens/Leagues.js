import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { Button, Card, ListItem } from "@rneui/base";
import { Avatar } from "@rneui/base/dist/Avatar/Avatar";
import { getDataCacheAPI } from '../predata/apidatafunctions.js';
import styles from "../styles/styles.js";

export default function Leagues({ navigation }) {
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);
  const [leaguesData, setLeaguesData] = useState([]);
  const [leagueTeamsData, setLeagueTeamsData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  let url = "https://api.opendota.com/api/leagues"
  const getData = async (url, type) => {
    let cache = type === 'leagueinfo' ? 'cachedLeagues' : type;
    let caller = type === 'leagueinfo' ? 'leagues' : type;
    try {
      const fetchedData = await getDataCacheAPI(url, cache, 24 * 60 * 60000, caller);
      if (type === 'leagueinfo') {
        setLeaguesData(fetchedData);
        setIsLoadingLeagues(false);
      } else {
        setLeagueTeamsData(fetchedData);
      }
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }

  useEffect(() => { getData(url, 'leagueinfo') }, []);

  keyExtractor = (item, index) => index.toString();
  // flatlist grididea modified from https://stackoverflow.com/a/46368597
  renderItem = ({ item }) => (
    <ListItem.Accordion containerStyle={styles.list}
      bottomDivider
      content={
        <ListItem.Content>
          <ListItem.Title style={{ color: 'white' }}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={{ color: 'white' }}>League tier: {item.tier}</ListItem.Subtitle>
        </ListItem.Content>
      }
      isExpanded={expanded === item.leagueid}
      onPress={() => handleExpand(item.leagueid)}
    >
      <FlatList
        numColumns={4}
        data={leagueTeamsData}
        renderItem={({ item }) =>
          <View style={{ backgroundColor: '#00001D', width: '25%', height: 125 }}>
            <Card containerStyle={styles.cardleagues}>
              <Avatar rounded size={50} containerStyle={{ alignSelf: 'center', backgroundColor: '#000' }} source={{ uri: item.logo_url }}
                onPress={() => navigation.navigate('Proteam', { item: item })} />
              <Card.Title onPress={() => navigation.navigate('Proteam', { item: item })}>{item.name}</Card.Title>
            </Card>
          </View>}>
      </FlatList>
    </ListItem.Accordion>
  );
  const handleExpand = (id) => {
    getData(url + '/' + id + '/teams', 'leagueTeams' + id);
    setExpanded(expanded === id ? false : id);

  };

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