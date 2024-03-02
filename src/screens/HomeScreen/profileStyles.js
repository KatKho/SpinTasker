import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#e1e1e1',
    borderWidth: 1,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#ffddd1'
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22, 
    justifyContent: 'center',
    alignItems: 'center', 
    width: '85%', 
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, 
    shadowRadius: 1.41,
    elevation: 2,
    
  },
  button: {
    backgroundColor: '#FF6B6B', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitleText: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    marginVertical: 8,
    width: '100%', 
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
    input: {
      borderBottomWidth: 1,
      borderColor: '#333', 
      flex: 1, 
      padding: 8, 
      fontSize: 16, 
    },
    editIcon: {
      width: 18,
      height: 18,
      marginLeft: 6,
      marginBottom: 4
    },
    

});
