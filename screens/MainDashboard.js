import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MainDashboard = ({ navigation }) => {
  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

const onChangeDate = (event, selectedDate) => {
  const currentDate = selectedDate || selectedDate; // Use the selectedDate if provided
  setShowDatePicker(Platform.OS === 'ios'); // Only necessary if you want to keep the picker open on iOS
  setSelectedDate(currentDate);
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
              display="spinner" // 'spinner' provides a consistent look across platforms
              onChange={onChangeDate}
            />
            {/* Buttons or touchable areas to confirm or cancel the date selection */}
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

      <TouchableOpacity style={styles.addButton} onPress={() => {/* Logic to add a task */}}>
        <Text>Add Task</Text>
      </TouchableOpacity>

      {/* Task Creation/Edit Modal */}
      {/* Add your modal component here */}
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
    marginTop: 20,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2
    },
    confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
    },
    // Add styles for the modal and other components as needed
  });
  
  export default MainDashboard;