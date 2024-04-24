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
import { Divider } from '@rneui/base';

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
      const fetchedData = await getChartData('mmrteams');
      //mmrhistogram
      // const toData = fetchedData.map(({count,bin}) => ({ value: count, label: bin }));
      //mmrteams
      const toData = fetchedData.map(({bucket_range,team_count}) => ({ value: team_count, label: bucket_range }));

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
      <View style={{borderRadius:10, backgroundColor:'#00002D', paddingHorizontal:35, paddingTop:15, paddingBottom:35, marginTop:15, width:'95%'}}> 
      <Text style={{textAlign:'left',color:'white', fontSize:18,fontWeight:'300', paddingBottom:5}}>Team rating distribution</Text>
      <BarChart
      dashGap={0}
      frontColor={'#00FFFF'}
      xAxisColor={'grey'}
      yAxisColor={'grey'}
      hideRules={true}
      showGradient
      rotateLabel
      roundedTop
      isAnimated
      showValuesAsTopLabel
      topLabelTextStyle={{fontSize:10, color:'#00FFFF', fontWeight:'bold'}}
      yAxisTextStyle={{fontSize:10, color:'#00FFFF'}}
      xAxisLabelTextStyle={{fontSize:10, color:'#00FFFF'}}
      labelWidth={30}
      height={200}
      barWidth={30}
      spacing={15}
      noOfSections={4}
      data={mmrHistogram} />
      </View>
    )
  }

    return (
      <View style={{flex: 1,alignItems:'center',backgroundColor: '#00001D'}} >
        
        {getAPIdata()}
        
      </View>
    );
  }