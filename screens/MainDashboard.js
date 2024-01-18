import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MainDashboard = ({ navigation }) => {
  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');


  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) { 
      setSelectedDate(selectedDate);
      setShowDatePicker(Platform.OS === 'ios'); // Hide the picker unless it's iOS
    }
  };
  
const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: false },
    // ... more tasks
]);

  // Function to handle task completion toggle
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Function to handle task selection from the wheel
  const selectTask = (taskId) => {
    // Logic to handle task selection
  };

    // Function to show the date picker
    const showDatePickerModal = () => {
        setShowDatePicker(true);
      };
    
    // Function to hide the date picker
    const hideDatePicker = () => {
        setShowDatePicker(false);
    };

    const toggleTaskModal = () => {
    setIsTaskModalVisible(!isTaskModalVisible);
    };

    const addTask = () => {
        const newTask = {
          id: Date.now(), // unique ID for the task
          name: taskName,
          description: taskDescription,
          completed: false,
          date: selectedDate,
        };
        setTasks([...tasks, newTask]);
        setTaskName('');
        setTaskDescription('');
        setIsTaskModalVisible(false);
      };
      

  return (
    <View style={styles.container}>
      <View style={styles.dropdownMenu}>
        <TouchableOpacity onPress={() => {/* Logic for Profile */}}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wheel}>
        {/* Add your wheel component here */}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => {/* Logic to add a task */}}>
        <Text>Spin!</Text>
      </TouchableOpacity>
    
      <TouchableOpacity onPress={showDatePickerModal} style={styles.dateDisplay}>
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.datePickerModal}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner" 
              textColor="black"
              onChange={onChangeDate}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskItem}
            onPress={() => toggleTaskCompletion(task.id)}
          >
            <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
              {task.name}
            </Text>
            <TouchableOpacity onPress={() => {/* Logic for Edit */}}>
              <Text>Edit</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={toggleTaskModal}>
      <Text>Add Task</Text>
      </TouchableOpacity>

      <Modal
  visible={isTaskModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={toggleTaskModal}
>
  <View style={styles.centeredView}>
    <View style={styles.taskModal}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        multiline
        value={taskDescription}
        onChangeText={setTaskDescription}
      />
<View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.saveButton}
    onPress={addTask}
  >
    <Text style={styles.saveButtonText}>Save</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={toggleTaskModal}
  >
    <Text style={styles.cancelButtonText}>Cancel</Text>
  </TouchableOpacity>
</View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
      borderWidth: 5,
      borderColor: '#64b5f6',
    },
    wheelText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#64b5f6',
    },
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
    },
    taskCompleted: {
      textDecorationLine: 'line-through',
      color: 'grey',
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
    // ... other styles

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
  
  });
  
  export default MainDashboard;