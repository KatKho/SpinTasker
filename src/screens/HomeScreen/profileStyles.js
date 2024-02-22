import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    profile: {
        width: 45,
        height: 45,
        marginLeft: 10,
      },
      modal: {
        // marginTop: 30,
        marginLeft: 10,
        marginTop: 150,
        // The following properties are used to center the modal on the screen
        flex: 1,
        justifyContent: 'flex-start',
        // justifyContent: 'center',
        // alignItems: 'center',
      },
      
      modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        // Make width and height equal for a circle and adjust size as needed
        width: 150,
        height: 150,
        // Set borderRadius to half of the width/height to make it a circle
        borderRadius: 75,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // Optionally, you can add elevation for shadow for Android and shadow properties for iOS
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      
    })