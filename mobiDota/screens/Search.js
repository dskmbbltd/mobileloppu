import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ButtonGroup, Button, Card, ListItem, Avatar, SearchBar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import proteamids from '../predata/proteamids.js';
import { getSearchData, getDataCacheAPI, getFollowedAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title.js';

export default function Search({ navigation }) {
  const urldatdota = "https://www.datdota.com/teams/"
  const urldotabuff = "https://www.dotabuff.com/esports/teams/"
  const urlstratz = "https://stratz.com/teams/"
  const [followedPlayersData, setFollowedPlayersData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const proTeamIdsAsNmbr = proteamids.map(Number);
  const [mode, setMode] = useState('');
  let naviLink = ''
  // Search value
  const [search, setSearch] = useState("");
  // BUTTONSTATES
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState([0, 1, 2]);

  const updateSearch = (search) => {
    setSearch(search);
  };
  // change navilink  in renderItem() depending on what we're searching for
  switch (selectedIndex) {
    case 0:
      naviLink = 'Player';
      break;
    case 1:
      naviLink = 'Proteam';
      break;
    case 2:
      naviLink = 'League';
      break;
  }
  const getData = async () => {
    try {
      const fetchedData = await getSearchData(selectedIndex, search);
      console.log("back here")
      setSearchData(fetchedData);
      setIsLoadingData(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => {
    if (selectedIndex === 0) { // player search rendering
    return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.avatarfull }} />
      <ListItem.Content>
        <ListItem.Title>{item.personaname}</ListItem.Title>
        <ListItem.Subtitle>{"Account id: "+item.account_id}</ListItem.Subtitle>
        <ListItem.Subtitle>{"Similarity: "+item.similarity}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate(naviLink, { item: item })} />
          </ListItem>
  )}
  if (selectedIndex === 1) { // team search rendering
    return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.logo_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{"Team id: "+item.team_id}</ListItem.Subtitle>
        <ListItem.Subtitle>{"Rating: "+item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate(naviLink, { item: item })} />
    </ListItem>
  )}
};

  // remove?
  const getAPIdata = () => {
    if (isLoadingData) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    return <FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={searchData}
      renderItem={renderItem}
    />
  }

  return (
    <View>
      <Text style={{ textAlign: 'center' }}>Search mode</Text>
      <ButtonGroup
        buttons={['PLAYERS', 'TEAMS', 'LEAGUES']}
        selectedButtonStyle={{backgroundColor: '#00001F'}}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
      />
      <Button onPress={getData}
      buttonStyle={{ backgroundColor: '#fff', marginBottom:5}}
      titleStyle={{color: '#000'}}
      >Search</Button>
      <FlatList
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        keyExtractor={keyExtractor}
        data={searchData}
        renderItem={renderItem}
      >
      </FlatList>
    </View>
  );
}