import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    profile: {
      width: 40,
      height: 40,
      borderRadius: 25,
      overflow: 'hidden',
      borderColor: '#e1e1e1',
      borderWidth: 1,
      marginLeft: 10,
      marginTop: 10,
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '80%',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      backgroundColor: '#1a73e8',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5, 
        backgroundColor: '#fafafa',
        height: 30, 
        borderColor: '#fafafa',
        borderWidth: 1,
        borderRadius: 10,

      },
      modalTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15, 
      },
    
    })