import { Linking, Text, View } from 'react-native';
import { Card, Avatar, Button } from '@rneui/themed';
import styles from '../styles/styles.js';

export default function Proplayer({ navigation, route }) {
  const urldotabuff = "https://www.dotabuff.com/players/"
  const urlstratz = "https://stratz.com/players/"
  const player = route.params.item;

  return (
    <Card containerStyle={styles.cardplayer}>

      <Avatar size={'xlarge'} containerStyle={{ backgroundColor: '#000', alignSelf: 'center' }} source={{ uri: player.avatarfull }} />
      <Card.Title style={{ color: 'white' }}>{"Name: " + player.name}</Card.Title>
      <Card.Title style={{ color: 'white' }}>{"Persona name: " + player.personaname}</Card.Title>

      <View style={{ width: '100%', flexDirection: 'row', marginBottom: 2 }}>
        <Button title='Dotabuff' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urldotabuff + player.account_id) }} />
        <Button title='Stratz' containerStyle={{ flex: 1 }} buttonStyle={styles.extbuttons} onPress={() => { Linking.openURL(urlstratz + player.account_id) }} />
      </View>

      <Text style={{ color: '#fff', textAlign: 'center' }}>{player.last_match_time ? "Last match time: " + player.last_match_time.replace(/[TZ]/g, ' ') : <></>}</Text>
      <Text style={{ color: '#fff', textAlign: 'center' }}>{player.team_name ? "Team: " + player.team_name : <></>}</Text>

    </Card>
  );
}



