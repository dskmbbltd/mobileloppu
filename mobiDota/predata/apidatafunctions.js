import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import proteamids from '../predata/proteamids.js';
import proleagueids from '../predata/proleagueids.js';

const getDataCacheAPI = async (url = '', cache, cachedMaxTime = 600000, caller = '') => {
    console.log("caller", caller)
    console.log("cache", cache)
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

        if (caller === 'proteam') {
            responseJSON = responseJSON.rows
        }
        if (caller === 'proteams') { // if calling from Proteams screen
            console.log("now in proteams")
            const proTeamIdsAsNmbr = proteamids.map(Number);

            // only set data for team id found in preset data
            responseJSON = responseJSON.filter(obj => proTeamIdsAsNmbr.includes(obj.team_id));

            // await AsyncStorage.setItem(cache, JSON.stringify(teamsInProTeamList));
            // await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());

            // return teamsInProTeamList;
        }
        if (caller === 'leagues') { // if calling from leagues screen
            console.log("now in leagues")

            // only set data for league ids found in preset data
            responseJSON = responseJSON.filter(obj => proleagueids.includes(obj.leagueid));
            // await AsyncStorage.setItem(cache, JSON.stringify(leaguesInProLeaguesList));
            // await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());
            // return leaguesInProLeaguesList;
        }


        await AsyncStorage.setItem(cache, JSON.stringify(responseJSON));
        await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());
        return responseJSON;


    } catch (e) {
        Alert.alert("Error fetching team data, function getDataCacheAPI:", e);
    }
};

const getFollowedData = async (cache) => {
    try {
        const cachedFollowed = await AsyncStorage.getItem(cache);
        console.log(cachedFollowed);
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
        console.log(cachedFollowed);
        cachedFollowed.push(dataToAdd);
        console.log(cachedFollowed);
        await AsyncStorage.setItem(cache, JSON.stringify(cachedFollowed));
        return cachedFollowed;
    } catch (e) {
        Alert.alert("Error adding data");
    }
};
const removeFollowedData = async (cache, dataToRemove) => {
    try {
        const cachedFollowed = await getFollowedData(cache);
        console.log(cachedFollowed);
        const dataRemoved = cachedFollowed.filter(followedId => followedId !== dataToRemove);
        console.log(dataRemoved);
        await AsyncStorage.setItem(cache, JSON.stringify(dataRemoved));
        return dataRemoved;
    } catch (e) {
        Alert.alert("Error removing data");
    }
}

const getFollowedAPI = async (cache, caller) => {
    try {
        if (caller === 'followedTeams') {
            console.log("now in followed")

            //only set data for 
            const followed = await getFollowedData(cache)
            console.log(followed)
            const urlMid = followed.join('%2C')
            const url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20teams.name%20%2C%0Ateams.team_id%2C%0Ateam_rating.rating%2C%0Ateam_rating.wins%2C%0Ateam_rating.losses%0AFROM%20teams%0ALEFT%20JOIN%20team_rating%20using(team_id)%0AWHERE%20TRUE%0AAND%20teams.team_id%20in%20(" +
                urlMid +
                ")%0AGROUP%20BY%20teams.name%2C%20teams.team_id%2C%20team_rating.rating%2C%20team_rating.wins%2Cteam_rating.losses%0A%0ALIMIT%20200"
            // const urlEnd = ")%0AGROUP%20BY%20teams.name%2C%20teams.team_id%2C%20team_rating.rating%2C%20team_rating.wins%2Cteam_rating.losses%0A%0ALIMIT%20200"
            // const url1 = urLStart+urlMid+urlEnd;
            console.log(url)
            const response = await fetch(url);
            const responseJSON = await response.json();
            const rows = responseJSON.rows
            console.log(rows)
            return rows;
        }
    } catch (e) {
        Alert.alert("Error getting follows")
    }
}

const getSearchData = async (searchmode, search) => {
    let url = '';
    switch (searchmode) {
        case 0:
            url = 'https://api.opendota.com/api/search?q=' + search;
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
        console.log(responseJSON)
        if (searchmode === 1) {
            console.log(responseJSON.rows)
            return responseJSON.rows
        }
        return responseJSON;
    } catch (e) {
        Alert.alert("Error while searching")

    }
}

const getChartData = async (data) => {
    let url = '';
    switch (data) {
        case 'mmrhistogram':
            url = "https://api.opendota.com/api/distributions"
            break;

        case value:

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
        return responseJSON;
    } catch (e) {
        Alert.alert("Error while searching")
    }
}
export {getChartData, getDataCacheAPI, getFollowedAPI, getFollowedData, getSearchData, addFollowedData, removeFollowedData };
