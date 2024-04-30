
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { useState } from 'react';
import { ButtonGroup, Button, ListItem, Avatar, SearchBar } from '@rneui/themed';
import { getSearchData } from '../predata/apidatafunctions.js';

export default function Search({ navigation }) {

  const [searchData, setSearchData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
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
      naviLink = 'Proplayer';
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
      setSearchData(fetchedData);
      setIsLoadingData(false);
    } catch (e) {
      Alert.alert("Error fetching data, function: getData", e)
    }
  }
 // TODO use playeroverlay. refactor to own component
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => {
    if (selectedIndex === 0) { // player search rendering
      if (!item.personaname) {
        return (<></>)
      }
      return (
    <ListItem bottomDivider>
      <Avatar containerStyle={{backgroundColor: '#000'}} source={{ uri: item.avatarfull }} />
      <ListItem.Content>
        <ListItem.Title>{'Name: '+item.name}</ListItem.Title>
        <ListItem.Title>{'Persona name: '+item.personaname}</ListItem.Title>
        <ListItem.Subtitle>{"Account id: "+item.account_id}</ListItem.Subtitle>
        <ListItem.Subtitle>{"Current team: "+item.team_name}</ListItem.Subtitle>
        <ListItem.Subtitle>{"Last match time: "+(item.last_match_time ? item.last_match_time : "No info")}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron onPress={() => navigation.navigate(naviLink, { item: item })} />
          </ListItem>
  )}
  if (selectedIndex === 1) { // team search rendering
    if (!item.logo_url) {
      return (<></>)
    }
    return (
    <ListItem bottomDivider>
      <Avatar containerStyle={{backgroundColor: '#000'}} source={{ uri: item.logo_url }} />
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
        buttons={['PLAYERS', 'TEAMS']}
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