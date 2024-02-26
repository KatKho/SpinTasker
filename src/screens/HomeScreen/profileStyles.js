import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20, // Updated for more rounded edges
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
    padding: 22, // Increased padding for more space
    justifyContent: 'center', // Centered content
    alignItems: 'center', // Centered content
    width: '85%', // Increased width for better use of space
    borderRadius: 10, // Consistent border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, // Softened shadow
    shadowRadius: 1.41,
    elevation: 2,
    
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12, // Slightly larger touch area
    paddingHorizontal: 25, // Slightly larger touch area
    borderRadius: 10, // Consistent border radius
    alignItems: 'center',
    marginTop: 20,
    width: '80%', // Match modal width
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitleText: {
    fontSize: 20, // Slightly larger for better hierarchy
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, // Increased spacing
  },
    infoRow: {
      width: '100%',
      flexDirection: 'row', // Align children in a row
      alignItems: 'flex-star', // Center children vertically
      color: '#333',
      marginVertical: 8, // Increased spacing
      paddingHorizontal: 10, // Added padding
      paddingVertical: 8, // Added padding
      backgroundColor: '#f8f9fa', // Lighter background for input fields
      borderRadius: 10, // Consistent border radius
    },
    
    icon: {
      width: 25,
      height: 25,
      marginRight: 10, 
    },
    
    infoText: {
      fontSize: 16,
      color: '#333',
    },
});
