import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { ListItem, Avatar, ButtonGroup } from '@rneui/themed';
import { getFollowedAPI, } from '../predata/apidatafunctions.js';
import styles from '../styles/styles.js';

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

export default function Followed({ navigation }) {
  const [followedData, setFollowedData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState([0, 1]);
const [visible, setVisible] = useState(false);

  const getData = async () => {
    let cache = ''
    let caller = ''
    switch (selectedIndex) {
      case 0:
        cache = 'followedTeams'
        caller = 'followedTeams'
        break;
        case 1:
        cache = 'players'
        caller = 'followedPlayers'
        break;
    }
    try {
      setIsLoadingData(true)
      const fetchedData = await getFollowedAPI(cache, caller);
      setFollowedData(fetchedData);
      setIsLoadingData(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }
  
  useEffect(() => { getData() }, [selectedIndex]);

   keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    
  <ListItem bottomDivider key={item.account_id}>
      <Avatar containerStyle={{backgroundColor: '#000', alignContent:'center'}} source={{ uri: item.logo_url || item.avatarmedium}} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      { item.logo_url ? <ListItem.Chevron onPress={() => navigation.navigate('Proteam', { item: item })} />
    : <ListItem.Chevron onPress={() => navigation.navigate('Proplayer', { item: item })} />}
    </ListItem>
  );

  // RETURNED
  const getAPIdata = () => {
    if (isLoadingData) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    if (!followedData) {
      return <Text style={{textAlign:'center'}}>Followed list is empty</Text>
    }
    return <><FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={followedData}
      renderItem={renderItem}
    />
  </>
  }
  
  return (
    <View >
       <ButtonGroup
        selectedButtonStyle={{backgroundColor: '#00001F'}}
        buttons={['TEAMS', 'PLAYERS']}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={ styles.button }
      />
      {getAPIdata()}
      </View>
  );
}