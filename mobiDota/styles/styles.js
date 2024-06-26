import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'top',
      backgroundColor: '#000010'
    },
    containerHero: {
      // flex: 1,
      flexDirection: 'row',
      width: '100%',
      // alignItems: 'center',
      // justifyContent: 'center',
      // justifyContent: 'top',
      backgroundColor: '#00114F',
      borderRadius: 10,
      marginTop: 5
    },
    card1: {
        backgroundColor: '#00001F',
        borderRadius: 5,
        borderColor: 'black',
        width: '95%',
    },
    cardproteam: {
        backgroundColor: '#00001F',
        borderRadius: 5,
        borderColor: 'black',
        width: '95%',
        flex: 1
    },
    cardplayer: {
        backgroundColor: '#00001F',
        borderRadius: 5,
        borderColor: 'black',
        width: '95%',
        flex: 1
    },
    cardleagues: {
      borderRadius: 5,
      marginHorizontal: 2,
      flex:1,
      width: '100%',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: '#EEE',
      justifyContent: 'top'
      
    },
    extbuttons: {
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor:'darkorange'
    },
    text: {
        color: 'white'
    },
    button : {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10,
        color: '#00001F',
      },
      list: {
        color: '#00001F',
        backgroundColor: '#00001F',
      },
      cardContainer: {
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'center',
      },
      proteamListItemContentAccordion: {
        flex:1,
        flexDirection:'row',
        justifyContent: 'left',
        alignItems:'center'
      }
  });