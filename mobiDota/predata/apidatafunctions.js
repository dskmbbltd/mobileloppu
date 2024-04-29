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
            responseJSON = responseJSON.rows
            // const proTeamIdsAsNmbr = proteamids.map(Number);

            // only set data for team id found in preset data
            // responseJSON = responseJSON.filter(obj => proTeamIdsAsNmbr.includes(obj.team_id));
        }
        if (caller === 'leagues') { // if calling from leagues screen
            console.log("now in leagues")

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
        // await AsyncStorage.removeItem(cache);
        const cachedFollowed = await getFollowedData(cache);
        console.log("current:"+cachedFollowed)
        const dataRemoved = cachedFollowed.filter(followedId => followedId !== dataToRemove);
        await AsyncStorage.setItem(cache, JSON.stringify(dataRemoved));
        console.log("after remove:"+dataRemoved)
        return dataRemoved;
    } catch (e) {
        Alert.alert("Error removing data");
    }
}

const getFollowedAPI = async (cache, caller) => {
    try {
        let url = ''
            const followed = await getFollowedData(cache)
            console.log(followed)
            const urlMid = followed.join('%2C')
            if (caller === 'followedTeams') {
            url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20teams.name%20%2C%0Ateams.team_id%2C%0Ateams.logo_url%2C%0Ateam_rating.rating%2C%0Ateam_rating.wins%2C%0Ateam_rating.losses%0AFROM%20teams%0ALEFT%20JOIN%20team_rating%20using(team_id)%0AWHERE%20TRUE%0AAND%20teams.team_id%20in%20(" +
                urlMid +
                ")%0AGROUP%20BY%20teams.name%2C%20teams.team_id%2C%20teams.logo_url%2C%20team_rating.rating%2C%20team_rating.wins%2Cteam_rating.losses%0A%0ALIMIT%20200"
                console.log(url)
            }
            if (caller === 'followedPlayers') {
                console.log("infollowed")
            url = "https://api.opendota.com/api/explorer?sql=SELECT%0A%20%20%20%20%20%20%20%20notable_players.name%20%2C%0Aavg(kills)%20%22AVG%20Kills%22%2C%0Acount(distinct%20matches.match_id)%20count%2C%0Asum(case%20when%20(player_matches.player_slot%20%3C%20128)%20%3D%20radiant_win%20then%201%20else%200%20end)%3A%3Afloat%2Fcount(1)%20winrate%2C%0A%20%20%20%20%20%20%20%20players.avatarmedium%2C%0A%20%20%20%20%20%20%20%20players.avatarfull%2C%0A%20%20%20%20%20%20%20%20players.account_id%0AFROM%20matches%0AJOIN%20match_patch%20using(match_id)%0AJOIN%20leagues%20using(leagueid)%0AJOIN%20player_matches%20using(match_id)%0AJOIN%20players%20using(account_id)%0ALEFT%20JOIN%20notable_players%20ON%20notable_players.account_id%20%3D%20player_matches.account_id%0ALEFT%20JOIN%20teams%20using(team_id)%0AWHERE%20TRUE%0AAND%20kills%20IS%20NOT%20NULL%20%0AAND%20player_matches.account_id%20IN%20("
            +urlMid+
            ")%0AGROUP%20BY%20notable_players.name%2C%20players.avatarfull%2C%20players.avatarmedium%2C%20players.account_id%0AHAVING%20count(distinct%20matches.match_id)%20%3E%3D%201%0AORDER%20BY%20%22AVG%20Kills%22%20DESC%2Ccount%20DESC%20NULLS%20LAST%0ALIMIT%20200"
        console.log(url)
        }
            const response = await fetch(url);
            const responseJSON = await response.json();
            const rows = responseJSON.rows
            console.log("rows"+rows)
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
export {getChartData, getDataCacheAPI, getFollowedAPI, getFollowedData, getSearchData, addFollowedData, removeFollowedData };
