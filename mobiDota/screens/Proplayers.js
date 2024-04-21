import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Card, ListItem, Avatar } from '@rneui/themed';
import db from '../db/db.js'
import proteamids from '../predata/proteamids.js';

export default function Proplayers() {
 

  return (
    <View><FlatList
      initialNumToRender={15}
      maxToRenderPerBatch={15}
      keyExtractor={keyExtractor}
      data={teamsData}
      renderItem={renderItem}
    /></View>
  );
}



