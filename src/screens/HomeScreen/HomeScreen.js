import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
import styles from './styles';
import { app } from '../../firebase/config'; 

export default function HomeScreen({ navigation, route }) {
  const auth = getAuth();
  const db = getFirestore(app);
  const userUID = route.params?.userId;

  // Initialize state variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Function to fetch tasks from Firestore
  const fetchTasks = async () => {
    console.log("Fetching tasks for userID:", userUID);
    try {
    const q = query(collection(db, "tasks"), where("userId", "==", userUID));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAllTasks(tasks);
    updateDisplayedTasks(selectedDate);
    } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
  };

// Effect to fetch tasks when userUID changes
useEffect(() => {
    if (userUID) {
      fetchTasks();
    }
  }, [userUID]);
  
  // Effect to update displayed tasks when selectedDate changes
  useEffect(() => {
    updateDisplayedTasks(selectedDate);
  }, [selectedDate, allTasks]);
  
  // Function to update displayed tasks based on the selected date
  const updateDisplayedTasks = (newDate) => {
    const filteredTasks = allTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === newDate.toDateString();
    });
    setDisplayedTasks(filteredTasks);
  };

  // Function to add a task
  const addTask = async () => {
    const newTask = {
      userId: userUID,
      name: taskName,
      description: taskDescription,
      completed: false,
      date: selectedDate.toISOString(),
    };

    const tasksRef = collection(db, 'tasks');
    try {
      const docRef = await addDoc(tasksRef, newTask);
      setAllTasks(prevTasks => [...prevTasks, { ...newTask, id: docRef.id }]);
      updateDisplayedTasks(selectedDate);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task: ', error);
    }

    setTaskName('');
    setTaskDescription('');
    setIsTaskModalVisible(false);
  };

//   // Function to update a task
//   const updateTask = async () => {
//     const taskRef = doc(db, "tasks", currentTask.id);
//     try {
//       await updateDoc(taskRef, {
//         name: taskName,
//         description: taskDescription,
//       });
//       await fetchTasks();
//     } catch (error) {
//       console.error('Error updating task: ', error);
//     }

//     setCurrentTask(null);
//     setIsEditModalVisible(false);
//     setTaskName('');
//     setTaskDescription('');
//   };

//   // Function to delete a task
//   const deleteTask = async () => {
//     const taskRef = doc(db, "tasks", currentTask.id);
//     try {
//       await deleteDoc(taskRef);
//       await fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task: ', error);
//     }

//     setCurrentTask(null);
//     setIsEditModalVisible(false);
//   };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error', error);
    }
  };
  // Function to handle date change
  const onChangeDate = (event, newSelectedDate) => {
    const currentDate = newSelectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    updateDisplayedTasks(currentDate);
  };

// Toggle task completion
const toggleTaskCompletion = async (taskId) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      const taskRef = doc(db, "tasks", taskId);
      try {
        await updateDoc(taskRef, {
          completed: !task.completed
        });
        await fetchTasks(); 
      } catch (error) {
        console.error('Error toggling task completion: ', error);
      }
    }
  };

// Function to update a task
const updateTask = async (taskId, updatedData) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, updatedData);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };
  
  // Function to delete a task
  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };
  
// Function to handle updating a task
const handleUpdateTask = async () => {
    if (currentTask) {
      await updateTask(currentTask.id, { name: taskName, description: taskDescription });
      setIsEditModalVisible(false);
      setCurrentTask(null);
      setTaskName('');
      setTaskDescription('');
    }
  };
  
  // Function to handle deleting a task
  const handleDeleteTask = async () => {
    if (currentTask) {
      await deleteTask(currentTask.id);
      setIsEditModalVisible(false);
      setCurrentTask(null);
    }
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