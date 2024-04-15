import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import proteamids from '../predata/proteamids.js';
import proleagueids from '../predata/proleagueids.js';

const getDataCacheAPI = async (url, cache, cachedMaxTime = 600000, caller = '') => {

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
        const responseJSON = await response.json();
        
        if (caller === 'proteams') { // if calling from Proteams screen
            console.log("now in proteams")
            const proTeamIdsAsNmbr = proteamids.map(Number);

            // only set data for team id found in preset data
            let teamsInProTeamList = responseJSON.filter(obj => proTeamIdsAsNmbr.includes(obj.team_id));

            await AsyncStorage.setItem(cache, JSON.stringify(teamsInProTeamList));
            await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());

            return teamsInProTeamList;
        }
          if (caller === 'leagues') { // if calling from leagues screen
            console.log("now in leagues")
            
           // only set data for league ids found in preset data
            let leaguesInProLeaguesList = responseJSON.filter(obj => proleagueids.includes(obj.leagueid));
            await AsyncStorage.setItem(cache, JSON.stringify(leaguesInProLeaguesList));
            await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());
            return leaguesInProLeaguesList;
        }

        await AsyncStorage.setItem(cache, JSON.stringify(responseJSON));
        await AsyncStorage.setItem(`${cache}Time`, Date.now().toString());
        return responseJSON;
        

    } catch (e) {
        Alert.alert("Error fetching team data, function getDataCacheAPI:", e);
    }
};

const getFollowedData = async (cache) => {
    console.log("ok")

    try {
    const cachedFollowed = await AsyncStorage.getItem(cache);
    console.log("cachedFollowed");
    console.log(cachedFollowed);
    if (cachedFollowed !== null) {
        console.log("piip")
        return JSON.parse(cachedFollowed);
    }
    return [];
} catch (e) {
    throw Alert.alert("Error fetching followed list.",e )
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
        console.log("now removing")
        console.log(cachedFollowed)
        const dataRemoved = cachedFollowed.filter(followedId => followedId !== dataToRemove);
        console.log("now removed")
        console.log(dataRemoved)
        await AsyncStorage.setItem(cache, JSON.stringify(dataRemoved));
        return dataRemoved;
    } catch (e) {
        Alert.alert("Error removing data");
    }
}
export {getDataCacheAPI, getFollowedData, addFollowedData, removeFollowedData};
