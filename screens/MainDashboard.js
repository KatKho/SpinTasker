import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MainDashboard = ({ navigation }) => {
  // Initialize state variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Initialize allTasks with an empty array
  const [allTasks, setAllTasks] = useState([]); // You should fetch this from a database or storage

  // Function to update displayed tasks based on the selected date
  const updateDisplayedTasks = (newDate) => {
    const filteredTasks = allTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === newDate.toDateString();
    });
    setDisplayedTasks(filteredTasks); // Update the state to reflect the filtered tasks
  };

  // Initialize displayedTasks with the tasks for today
  const [displayedTasks, setDisplayedTasks] = useState([]);

  // Function to handle date change
  const onChangeDate = (event, newSelectedDate) => {
    const currentDate = newSelectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    updateDisplayedTasks(currentDate);
  };

  // Function to add a task
  const addTask = () => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9), // Generating a unique ID
      name: taskName,
      description: taskDescription,
      completed: false,
      date: selectedDate.toISOString(),
    };
    setAllTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      updateDisplayedTasks(selectedDate); // Update displayed tasks
      return updatedTasks;
    });
    setTaskName('');
    setTaskDescription('');
    setIsTaskModalVisible(false);
  };

  // Function to handle task completion toggle
  const toggleTaskCompletion = (taskId) => {
    setAllTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
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

      
      const showEditModal = (task) => {
        setCurrentTask(task);
        setTaskName(task.name);
        setTaskDescription(task.description);
        setIsEditModalVisible(true);
      };
      
// Function to delete a task
const handleDeleteTask = () => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== currentTask.id);
      updateDisplayedTasks(selectedDate); // Update displayed tasks
      return updatedTasks;
    });
    setCurrentTask(null);
    setIsEditModalVisible(false);
  };

  // Function to handle task update
  const handleUpdateTask = () => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === currentTask.id) {
          return { ...task, name: taskName, description: taskDescription };
        }
        return task;
      });
      updateDisplayedTasks(selectedDate); // Update displayed tasks
      return updatedTasks;
    });
    setCurrentTask(null);
    setIsEditModalVisible(false);
  };

  useEffect(() => {
    updateDisplayedTasks(selectedDate);
  }, [selectedDate, allTasks]);



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
        {displayedTasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskItem}
            onPress={() => toggleTaskCompletion(task.id)}
          >
            <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
              {task.name}
            </Text>
            <TouchableOpacity onPress={() => showEditModal(task)}>
  <Text>Edit</Text>
</TouchableOpacity>

<Modal
  visible={isEditModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setIsEditModalVisible(false)}
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
          onPress={handleUpdateTask}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTask}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
  
  });
  
  export default MainDashboard;