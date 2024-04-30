import { View } from 'react-native';
import { Button, Card, Text } from '@rneui/base'
import styles from '../styles/styles.js'
import { Divider } from '@rneui/base';

export default function GraphsHome({ navigation }) {
  const navigateButtons = [{
    title: 'Team rating distributions',
    navigate: 'Charts'
  },
  {
    title: 'Hero stats',
    navigate: 'Heroes'
  },
  ];

  return (
    <View >
      <Card containerStyle={styles.card1}>
        <Text style={styles.text} h2>Graphs and Statistics</Text>
        <Text style={styles.text} >Relying on opendota API and Gifted Charts.</Text>
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