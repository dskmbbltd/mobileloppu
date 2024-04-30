import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import proleagueids from '../predata/proleagueids.js';
// cache: name of stored item in asyncstorage
// cachedmaxtime: time to consider data as 'fresh'
// caller: which screen/function/other identifier called the function
const getDataCacheAPI = async (url = '', cache, cachedMaxTime = 600000, caller = '') => {
    try {
        const cachedData = await AsyncStorage.getItem(cache);
        const cachedDataTime = await AsyncStorage.getItem(`${cache}Time`);

        if (cachedData && cachedDataTime) {
            const JSONparsed = JSON.parse(cachedData);
            const dataTimeNow = parseInt(cachedDataTime);

            if (Date.now() - dataTimeNow < cachedMaxTime) { // DATA EXISTS, IS FRESH
                console.log("loading cached data");
                return JSONparsed;
            }
        }
        console.log("Data either stale or nonexistent, attempting to fetch");

        const response = await fetch(url);
        let responseJSON = await response.json();

        if (caller === 'proteam' || caller === 'proteams') {
            responseJSON = responseJSON.rows
        }
        if (caller === 'leagues') { // if calling from leagues screen
            // only set data for league ids found in preset data
            responseJSON = responseJSON.filter(obj => proleagueids.includes(obj.leagueid));
        }

        await AsyncStorage.setItem(cache, JSON.stringify(responseJSON));
        await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());
        return responseJSON;
    } catch (e) {
        Alert.alert("Error fetching team data, function getDataCacheAPI:", e);
    }
};

// for Followed
const getFollowedData = async (cache) => {
    try {
        const cachedFollowed = await AsyncStorage.getItem(cache);
        if (cachedFollowed !== null) {
            return JSON.parse(cachedFollowed);
        }
        return [];
    } catch (e) {
        Alert.alert("Error fetching followed list.", e)
    }
};
const addFollowedData = async (cache, dataToAdd) => {
    try {
        const cachedFollowed = await getFollowedData(cache);
        cachedFollowed.push(dataToAdd);
        await AsyncStorage.setItem(cache, JSON.stringify(cachedFollowed));
        return cachedFollowed;
    } catch (e) {
        Alert.alert("Error adding data");
    }
};
const removeFollowedData = async (cache, dataToRemove) => {
    try {
        const cachedFollowed = await getFollowedData(cache);
        const dataRemoved = cachedFollowed.filter(followedId => followedId !== dataToRemove);
        await AsyncStorage.setItem(cache, JSON.stringify(dataRemoved));
        return dataRemoved;
    } catch (e) {
        Alert.alert("Error removing data");
    }
}

const getFollowedAPI = async (cache, caller) => {
    try {
        let url = ''
        const followed = await getFollowedData(cache)
        const urlMid = followed.join('%2C')
        if (caller === 'followedTeams') {
            url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20teams.name%20%2C%0Ateams.team_id%2C%0Ateams.logo_url%2C%0Ateam_rating.rating%2C%0Ateam_rating.wins%2C%0Ateam_rating.losses%0AFROM%20teams%0ALEFT%20JOIN%20team_rating%20using(team_id)%0AWHERE%20TRUE%0AAND%20teams.team_id%20in%20(" +
                urlMid +
                ")%0AGROUP%20BY%20teams.name%2C%20teams.team_id%2C%20teams.logo_url%2C%20team_rating.rating%2C%20team_rating.wins%2Cteam_rating.losses%0A%0ALIMIT%20200"
        }
        if (caller === 'followedPlayers') {
            url = 'https://api.opendota.com/api/explorer?sql=SELECT%20*%0AFROM%20notable_players%0AJOIN%20players%20using(account_id)%0AWHERE%20notable_players.account_id%20IN%20(' + urlMid + ')';

        }
        const response = await fetch(url);
        const responseJSON = await response.json();
        const rows = responseJSON.rows
        return rows;
    } catch (e) {
        Alert.alert("Error getting follows")
    }
}

// for Search screen
const getSearchData = async (searchmode, search) => {
    let url = '';
    switch (searchmode) {
        case 0:
            url = 'https://api.opendota.com/api/explorer?sql=SELECT%20*%0AFROM%20notable_players%0AJOIN%20players%20using(account_id)%0AWHERE%20notable_players.name%20ILIKE%20%27%25' + search + '%25%27';
            break;
        case 1:
            url = 'https://api.opendota.com/api/explorer?sql=SELECT%20t.*%2C%20tr.rating%0D%0AFROM%20teams%20t%0D%0AJOIN%20team_rating%20tr%20ON%20t.team_id%20%3D%20tr.team_id%0D%0AWHERE%20t.name%20ILIKE%20%27%25' + search + '%25%27%0D%0AORDER%20BY%20tr.rating%20DESC%3B';
            break;
        case 2:
            url = '';
            break;
    }
    try {
        const response = await fetch(url);
        const responseJSON = await response.json()
        return responseJSON.rows
    } catch (e) {
        Alert.alert("Error while searching")
    }
}

// for Charts screen
const getChartData = async (data) => {
    let url = '';
    switch (data) {
        case 'mmrhistogram':
            url = "https://api.opendota.com/api/distributions"
            break;

        case 'mmrteams':
            url = "https://api.opendota.com/api/explorer?sql=SELECT%0D%0A%20%20bucket_range%2C%0D%0A%20%20COUNT(*)%20AS%20team_count%0D%0AFROM%20(%0D%0A%20%20SELECT%0D%0A%20%20%20%20floor(rating%20%2F%20200)%20*%20200%20AS%20bucket_range%0D%0A%20%20FROM%20team_rating%0D%0A)%20AS%20subq%0D%0AGROUP%20BY%20bucket_range%0D%0AORDER%20BY%20bucket_range%3B"
            break;

        default:
            break;
    }
    try {
        const response = await fetch(url);
        const responseJSON = await response.json()
        if (data === 'mmrhistogram') {
            return responseJSON.ranks.rows;
        }
        return responseJSON.rows;
    } catch (e) {
        Alert.alert("Error while searching")
    }
}
export { getChartData, getDataCacheAPI, getFollowedAPI, getFollowedData, getSearchData, addFollowedData, removeFollowedData };
