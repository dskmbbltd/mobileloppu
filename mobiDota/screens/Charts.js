import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getChartData } from '../predata/apidatafunctions.js';
import { BarChart } from "react-native-gifted-charts";

export default function Charts({ navigation }) {
  // const data=[ {value:50}, {value:80}, {value:90}, {value:70} ] // test data
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [mmrHistogram, setMmrHistogram] = useState([]);

  const getData = async () => {
    try {
      const fetchedData = await getChartData('mmrteams');
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