import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      dropdownMenu: {
        // Styles for the dropdown menu will depend on the component you choose to implement it
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#eceff1',
      },
      wheel: {
        marginVertical: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200, // Arbitrary size, you can adjust as needed
        width: 200, // This should be a square
        borderRadius: 100, // Half of the size to make it a circle
        // borderWidth: 5,
        // borderColor: '#64b5f6',
        // backgroundColor: 'lightblue'
      },
      // wheelText: {
      //   fontSize: 18,
      //   fontWeight: 'bold',
      //   color: '#64b5f6',
      // },
      taskList: {
        flex: 1,
        marginTop: 20,
      },
      taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eceff1',
      },
      taskText: {
        fontSize: 16,
        marginLeft: 10
      },
      taskCompletedLine: {
        position: 'absolute',
        height: 2, // Height of the line
        backgroundColor: 'red', // Color of the line
        width: '120%', // Line width - set to 100% of the container width
        top: '50%', // Align to the vertical middle of the item
        marginLeft: -30,
      },
      editText: {
        color: '#64b5f6',
      },
      addButton: {
        backgroundColor: '#64b5f6',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      dateText: {
        alignSelf: 'center',
        alignItems: 'center',
      },
      centeredView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22,
        },
        datePickerModal: {
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
      },
       confirmButton: {
      backgroundColor: '#0275d8', // Bootstrap info blue for confirm button
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 30,
      alignSelf: 'center', // Center button in modal
      marginTop: 10,
    },
      confirmButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
      },
  
      taskModal: {
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          width: '90%', // Adjust the width if necessary
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
    
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333', // Dark grey for text
    },
    
    input: {
      height: 50, // Larger input for better touch area
      borderColor: '#ddd', // Light grey border
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderRadius: 10, // Rounded corners for inputs
      backgroundColor: '#fafafa', // Slightly off-white background
      fontSize: 16, // Larger font size
    },
    
    saveButton: {
      backgroundColor: '#5cb85c', // Bootstrap success green for save button
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'center', 
    },
    
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
    cancelButton: {
      backgroundColor: '#d9534f', // Bootstrap danger red for cancel/delete button
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'center', 
    },
    
    cancelButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly', 
      marginTop: 20,
    },
  
    deleteButton: {
      backgroundColor: '#d9534f', // Bootstrap danger red for delete button
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      // alignSelf: 'center', // You can remove alignSelf if you are using buttonContainer for positioning
    },
    
    deleteButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
    checkboxBase: {
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderWidth: 2,
      borderColor: 'grey',
      backgroundColor: 'transparent',
  },
  checkboxChecked: {
      backgroundColor: 'lightblue', 
  },
  checkboxCheckmark: {
      fontWeight: 'bold',
      color: 'black',
      fontSize: 20

  },
  wheelContainer: {
    position: 'relative', // This is important for absolute children
    height: 200, // Same as SVG height
    width: 200, // Same as SVG width
    justifyContent: 'center', // Centers children vertically in the container
    alignItems: 'center', // Centers children horizontally in the container
  },
  // wheelSection: {
  //   // width: 200, // Same as wheelContainer width
  //   // height: 100, // Half of wheelContainer height
  //   // // borderTopRightRadius: 100, // Same as wheelContainer borderRadius
  //   // // borderBottomRightRadius: 100, // Same as wheelContainer borderRadius
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },
  spinButton: {
    position: 'absolute',
    width: 70, // Adjust size as needed
    height: 70, // Adjust size as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD65C', // Button color
    borderRadius: 35, // Half of width/height
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    marginTop: -35, // Adjust for the size of the button to center
    marginLeft: -35, // Adjust for the size of the button to center
    borderWidth: 5, // Width of the border
    borderColor: 'white', // Color of the border
  },
  spinButtonText: {
    fontSize: 16,
    color: 'black', // Text color
  },

  logo: {
    flex: 1,
    height: 450,
    width: 255,
    alignSelf: "center",
},
    })