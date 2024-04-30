import { View } from 'react-native';
import { Button, Card, Text } from '@rneui/base'
import styles from '../styles/styles.js'
import { Divider } from '@rneui/base';

export default function Home({ navigation }) {
  
  const navigateButtons = [{
    title: 'TOP 100 Pro teams',
    navigate: 'Proteams'
  },
  {
    title: 'Leagues',
    navigate: 'Leagues'
  },
  {
    title: 'Followed',
    navigate: 'Followed'
  },
  {
    title: 'Search',
    navigate: 'Search'
  },
  ];

  return (
    <View >
      <Card containerStyle={styles.card1}>
        <Text style={styles.text} h2>Welcome</Text>
        <Text style={styles.text} >Application for viewing pro dota information.</Text>
        <Text style={styles.text} >Relying on opendota API.</Text>
      </Card>
      <Card containerStyle={styles.card1}>
        {navigateButtons.map((screen, key) => {
          return (
            <View key={key}>
            <Button 
              containerStyle={styles.button}
              color={'#00001D'}
              title={screen.title}
              onPress={() => navigation.navigate(screen.navigate)}
            />
            <Divider color={'darkred'}
            inset={true} insetType="middle"/>
            </View>
          )
        })}
      </Card>
    </View>
  );
}