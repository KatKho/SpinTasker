import React, { useState, useEffect } from 'react';
import { Platform, View, Text,TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styles from './styles';
import { app } from '../../firebase/config'; 

export default function HomeScreen({ navigation, route }) {
    const auth = getAuth();

    const userUID = route.params?.userId;
    const db = getFirestore(app);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            console.error('Sign out error', error);
        });
    };

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
      userId: userUID,
      name: taskName,
      description: taskDescription,
      completed: false,
      date: selectedDate.toISOString(),
    };
  
    // Save the task to Firestore
    const tasksRef = collection(db, 'tasks');
    addDoc(tasksRef, newTask)
      .then((docRef) => {
        console.log('Task added successfully with ID:', docRef.id);
        // Update local state to include the new task
        setAllTasks(prevTasks => [...prevTasks, { ...newTask, id: docRef.id }]);
        updateDisplayedTasks(selectedDate); // Update displayed tasks
      })
      .catch((error) => {
        console.error('Error adding task: ', error);
      });
  
    // Reset task input fields
    setTaskName('');
    setTaskDescription('');
    setIsTaskModalVisible(false);
  };
//     setAllTasks(prevTasks => {
//       const updatedTasks = [...prevTasks, newTask];
//       updateDisplayedTasks(selectedDate); // Update displayed tasks
//       return updatedTasks;
//     });
//     setTaskName('');
//     setTaskDescription('');
//     setIsTaskModalVisible(false);
//   };

  // Function to handle task completion toggle
//   const toggleTaskCompletion = (taskId) => {
//     setAllTasks(prevTasks => prevTasks.map(task => {
//       if (task.id === taskId) {
//         return { ...task, completed: !task.completed };
//       }
//       return task;
//     }));
//   };

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
    setTaskName('');
    setTaskDescription('');
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
    setTaskName('');
    setTaskDescription('');
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
          <Button title="Sign Out" onPress={handleSignOut} />
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