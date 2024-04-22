import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ButtonGroup, Button, Card, ListItem, Avatar, SearchBar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import proteamids from '../predata/proteamids.js';
import { getChartData, getSearchData, getDataCacheAPI, getFollowedAPI, getFollowedData, addFollowedData, removeFollowedData } from '../predata/apidatafunctions.js';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title.js';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";

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

export default function Charts({ navigation }) {

  const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [mmrHistogram, setMmrHistogram] = useState([]);
  

  const getData = async () => {
    try {
      const fetchedData = await getChartData('mmrhistogram');
      const toData = fetchedData.map(({count,bin}) => ({ value: count, label: bin }));

      setMmrHistogram(toData);
      console.log(toData);
      setIsLoadingData(false);
    } catch (e) {
      Alert.alert("Error fetching data", e);
    }
  }

  useEffect(() => { getData() }, []);

  const getAPIdata = () => {
    if (isLoadingData) {
      return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
    }
    return (
      <BarChart
      horizontal
      xAxisLabelsVerticalShift={1}
      roundedTop
      isAnimated
      // rotateLabel
      barWidth={10}
      spacing={6}
      noOfSections={3}
      data={mmrHistogram} />
    )
  }

    return (
      <View style={{flex: 1,backgroundColor: 'white'}} >
        
        {getAPIdata()}
        
      </View>
    );
  }