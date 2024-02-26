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
        height: 210, // Arbitrary size, you can adjust as needed
        width: 210, // This should be a square
        // borderRadius: 100, // Half of the size to make it a circle
        // borderWidth: 5,
        // borderColor: '#64b5f6',
        // backgroundColor: 'lightblue'
      },
      placeholderContainer: {
        marginTop: 6.5,
        height: 220, 
        width: 220,
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
      // taskItem: {
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   justifyContent: 'space-between',
      //   paddingVertical: 10,
      //   paddingHorizontal: 15,
      //   borderBottomWidth: 1,
      //   borderBottomColor: '#eceff1',
      // },
      taskText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333333', 
        fontWeight:'bold',
      },
      taskCompletedLine: {
        position: 'absolute',
        height: 2, // Height of the line
        backgroundColor: 'red', // Color of the line
        width: '120%', // Line width - set to 100% of the container width
        top: '30%', // Align to the vertical middle of the item
        marginLeft: -34,
      },
      editText: {
        color: '#64b5f6',
      },
      addButton: {
        // backgroundColor: '#64b5f6',
        // borderRadius: 30,
        // paddingVertical: 10,
        // paddingHorizontal: 18,
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 30,
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF7F50', // You can adjust the color to match your theme
        borderRadius: 40, // Half of the width/height to make it circular
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
      },
      dateText: {
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 16
      },
      dateTextContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center', 
      },
      calendarIcon: {
        width: 25, 
        height: 25, 
        marginRight: 10, 
      },
      centeredView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        // datePickerModal: {
        //   backgroundColor: 'white',
        //   borderRadius: 20,
        //   padding: 35,
        //   alignItems: 'center',
        //   shadowColor: '#000',
        //   shadowOffset: {
        //     width: 0,
        //     height: 2
        //   },
      // shadowOpacity: 0.25,
      // shadowRadius: 4,
      // elevation: 5
      // },
      confirmButton: {
      backgroundColor: '#0275d8', // Bootstrap info blue for confirm button
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 30,
      alignSelf: 'center', // Center button in modal
      marginTop: 10,
    },
      confirmButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
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
      backgroundColor: '#6BCB77',
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
      backgroundColor: '#FF6B6B', // Bootstrap danger red for cancel/delete button
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
      marginTop: 5,
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
    
  //   checkboxBase: {
  //     width: 30,
  //     height: 30,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     borderRadius: 1,
  //     borderWidth: 2,
  //     borderColor: 'grey',
  //     backgroundColor: 'transparent',
  // },
  // checkboxChecked: {
  //     backgroundColor: 'white', 
  // },
  // checkboxCheckmark: {
  //     fontWeight: 'bold',
  //     color: 'red',
  //     fontSize: 22

  // },
  wheelContainer: {
    position: 'relative',
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for the wheel container
    borderRadius: 100, // Half the size to make it a perfect circle
    borderWidth: 10, // Thickness of the border
    borderColor: '#FFA07A', // Color of the border to match the spin button
    elevation: 10, // This adds a shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow position for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 8, // Shadow blur radius for iOS
  },
  spinButton: {
    position: 'absolute',
    width: 80, // Width of the spin button
    height: 80, // Height of the spin button
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7F50', // You can adjust the color to match your theme
    borderRadius: 40, // Half of the width/height to make it circular
    top: '50%',
    left: '50%',
    marginTop: -40, // Half of the height to ensure it's centered
    marginLeft: -40, // Half of the width to ensure it's centered
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  spinButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logo: {
    flex: 1,
    height: 450,
    width: 255,
    alignSelf: "center",
},
rowFront: {
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#eceff1',
  backgroundColor: 'white',
  justifyContent: 'flex-start', // Align items to the left rather than center
  paddingLeft: 20, // Add padding to the left
  height: 60, // Increase the height for more space
  flexDirection: 'row', // Use flex-direction for internal alignment
  shadowOpacity: 0.1, // Optional: Add shadow for depth (iOS only)
  shadowRadius: 3,
  shadowColor: 'black',
  shadowOffset: { height: 1, width: 0 },
  elevation: 3, // Optional: Add elevation for shadow on Android
},
rowBack: {
  alignItems: 'center',
  backgroundColor: '#DDD',
  // flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  height: 60,

},
backRightBtn: {
  alignItems: 'center',
  bottom: 0,
  justifyContent: 'center',
  position: 'absolute',
  borderBottomWidth: 1,
  borderColor: '#fff',

  top: 0,
  width: 75,
  height: 60
},
backRightBtnLeft: {
  backgroundColor: 'green',
  right: 225,
},
backRightBtnCenter: {
  backgroundColor: 'orange',
  right: 75,
},
backRightBtnRight: {
  backgroundColor: 'red',
  right: 0,
},
backRightBtnRightLast: {
  backgroundColor: 'blue',
  right: 150,
},
backTextWhite: {
  color: '#FFF',
  fontWeight:'bold',
},
taskLogo: {
width: 25,
height: 25,
},
rowFrontContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 20,
  paddingRight: 20, // Add padding to the right for space around the icon
  height: 60,
},
pointer: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -55,
  marginLeft: -15,
  width: 100,
  height: 100,
  color: 'white',
  shadowOpacity: 0.1, 
  shadowRadius: 3,
  shadowColor: 'black',
  shadowOffset: { height: 1, width: 0 },
},

calendarModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 20,
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

// Style for the calendar component
calendar: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8
},

    })