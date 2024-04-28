import { useEffect, useState } from "react";
import { getDataCacheAPI } from "../predata/apidatafunctions";
import styles from "../styles/styles";
import { FlatList, Button, StyleSheet, Alert, ActivityIndicator, Text, View } from "react-native";
import { Card } from "@rneui/base";
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { Picker } from '@react-native-picker/picker';


export default function HeroStats({ navigation }) {
    const [heroStats, setHeroStats] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [selectedHero, setSelectedHero] = useState([]);
    const [chartdata, setChartData] = useState();
    const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]; //test mock data


    const getData = async () => {
        const url = "https://api.opendota.com/api/heroStats";
        const caller = "herostats";
        const cache = "herostats";
        try {
            const fetchedData = await getDataCacheAPI(url, cache, 86400000, caller); // 24h cachetime
            let fetchedDataSort = fetchedData.sort((heroA, heroB) => { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
                return heroA.localized_name.localeCompare(heroB.localized_name)
            });
            setHeroStats(fetchedDataSort);
            // console.log(fetchedData);
            setIsLoadingData(false);

        } catch (e) {
            Alert.alert("Error fetching data: ", e);
        };
    };

    useEffect(() => { getData() }, []);

    const getAPIdata = () => {
        if (isLoadingData) {
            return <><ActivityIndicator style={styles.loading} size="large" /><Text style={{ textAlign: 'center' }}>Fetching data...</Text></>
        };
        // console.log(heroStats)
        return <Picker mode='dial' style={{ backgroundColor: '#fff', width: '50%' }}
            selectedValue={selectedHero}
            onValueChange={(hero, index) =>
                handleChange(hero)}>
            {heroStats.map((hero, key) => (
                <Picker.Item style={{ backgroundColor: '#fff', color: '#000' }} label={hero.localized_name} key={key} value={hero} />
            ))};
        </Picker>
    };

    const handleChange = (hero) => {
        setSelectedHero(hero);
        const keys = ["pro_pick", "pro_win", "pro_ban"]
        datatoset = keys.map(key => {
            return { value: hero[key], label: key }
        });
        console.log(datatoset);
        setChartData(datatoset);
    }

    return (
        <View style={styles.container}>
            {getAPIdata()}
            <Text style={{ color: '#fff' }}>Hero stats</Text>
            <View>
                <BarChart
                    // width={300}
                    // height={200}
                    dashGap={0}
                    frontColor={'lightblue'}
                    xAxisColor={'grey'}
                    // yAxisColor={'grey'}
                    barWidth={40}
                    hideRules={true}
                    hideYAxisText
                    yAxisTextStyle={{ fontSize: 10, color: '#fff' }}
                    xAxisLabelTextStyle={{ fontSize: 10, color: 'rgb(255, 45, 85)' }}
                    showValuesAsTopLabel
                    isAnimated
                    topLabelTextStyle={{ fontSize: 10, color: 'rgb(255, 45, 85)', fontWeight: 'bold' }}
                    data={chartdata} />
                {/* <Text>Total</Text>  */}
            </View>
        </View>
    )
}