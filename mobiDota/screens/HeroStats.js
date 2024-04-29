import { useEffect, useState } from "react";
import { getDataCacheAPI } from "../predata/apidatafunctions";
import styles from "../styles/styles";
import { FlatList, Button, StyleSheet, Alert, ActivityIndicator, Text, View } from "react-native";
import { Card } from "@rneui/base";
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { Picker } from '@react-native-picker/picker';


export default function HeroStats({ navigation }) {
    const [heroStats, setHeroStats] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [selectedHero, setSelectedHero] = useState();
    const [chartdata, setChartData] = useState(false);
    // const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]; //test mock data
    let fetchedDataSort = []

    const getData = async () => {
        const url = "https://api.opendota.com/api/heroStats";
        const caller = "herostats";
        const cache = "herostats";
        try {
            const fetchedData = await getDataCacheAPI(url, cache, 86400000, caller); // 24h cachetime
            fetchedDataSort = fetchedData.sort((heroA, heroB) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
                return heroA.localized_name.localeCompare(heroB.localized_name)
            });
            setHeroStats(fetchedDataSort);
            // console.log(fetchedDataSort);
            setIsLoadingData(false);

        } catch (e) {
            Alert.alert("Error fetching data: ", e);
        };
    };

    useEffect(() => { getData() }, []);



    const getAPIdata = () => {
        if (isLoadingData || !heroStats) {
            return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        } else {
        return <Picker mode='dial' style={{ backgroundColor: '#fff', width: '50%' }} selectedValue={selectedHero ? selectedHero : 'none'} onValueChange={(hero) => handleChange(hero)}>
            {heroStats.map((item) => { return (<Picker.Item style={{color: '#000'}} key={item.id} label={item.localized_name} value={item}></Picker.Item> ) })}
                </Picker>       
    }};

    const handleChange = (hero) => {
        setSelectedHero(hero);
        const keys = ["pro_pick", "pro_win", "pro_ban"]
        datatoset = keys.map(key => {
            return { value: hero[key], label: key }
        });
        setChartData(datatoset);
    }

    return (
        <View style={styles.container}>
            <Text style={{ color: '#fff' }}>Choose hero to view stats for:</Text>
            {getAPIdata()}
            
            {/* {chartdata === false ? <></>: */}
                <View style={{backgroundColor: '#00002F', margin: 20, borderRadius: 10}}>
                <View style={{backgroundColor: '#00003F', margin: 10, borderRadius: 10}}>
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Picks, wins & bans</Text>
                <BarChart
                    // width={300}
                    // height={200}
                    dashGap={0}
                    frontColor={'#00002F'}
                    // barBorderColor={'#000000'}
                    // barBorderWidth={2}
                    barBorderRadius={5}
                    xAxisColor={'#00002F'}
                    yAxisColor={'#00002F'}
                    showGradient
                    barWidth={40}
                    hideRules={true}
                    hideYAxisText
                    yAxisTextStyle={{ fontSize: 10, color: '#fff' }}
                    xAxisLabelTextStyle={{ fontSize: 10, color: 'rgb(255, 45, 85)' }}
                    showValuesAsTopLabel
                    isAnimated
                    topLabelTextStyle={{ fontSize: 10, color: 'rgb(255, 45, 85)', fontWeight: 'bold' }}
                    data={chartdata ? chartdata : []} />
                <Text>Total</Text>
            </View>
            </View>
    {/* } */}
        </View>
    )
}