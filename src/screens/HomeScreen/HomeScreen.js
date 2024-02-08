import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, TouchableOpacity, Modal, TextInput, Button, Easing } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
import styles from './styles';
import { app } from '../../firebase/config'; 
import Svg, { Path, G, Polygon } from 'react-native-svg';
import { Animated } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const auth = getAuth();
  const db = getFirestore(app);
  const userUID = route.params?.userId;
  const spinValue = useRef(new Animated.Value(0)).current;
  const pointerSize = 30;
  const wheelSize = 200;
  const finalAngleRef = useRef(0);
  const extraSpins = 5;

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
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [winningTaskId, setWinningTaskId] = useState(null);
  const [winningColor, setWinningColor] = useState('black');

  const tasksForWheel = allTasks.filter(task => selectedTasks.includes(task.id));

// Function to fetch tasks from Firestore
const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userUID));
      const querySnapshot = await getDocs(q);
      const tasksWithColors = querySnapshot.docs.map((doc) => {
        const taskData = doc.data();
        // Assign a color if it doesn't have one, else use the existing color
        taskData.color = taskData.color || getRandomColor();
        return {
          id: doc.id,
          ...taskData
        };
      });
      setAllTasks(tasksWithColors); // Update the tasks with colors
      updateDisplayedTasks(selectedDate);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [userUID]); // Runs only when the userUID changes
  

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
      
    // Function to handle checkbox toggle
    const handleCheckboxToggle = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    // Custom Checkbox Component
    const CustomCheckbox = ({ taskId }) => {
        const isChecked = selectedTasks.includes(taskId);
        return (
            <TouchableOpacity
                style={[styles.checkboxBase, isChecked && styles.checkboxChecked]}
                onPress={() => handleCheckboxToggle(taskId)}
            >
                {isChecked && <Text style={styles.checkboxCheckmark}>✔</Text>}
            </TouchableOpacity>
        );
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const assignColorsToTasks = (tasks) => {
        return tasks.map(task => ({ ...task, color: getRandomColor() }));
      };

      const PieSlice = ({ color, angle, index, tasksLength }) => {
        const radius = 100;
        const pathData = tasksLength === 1
          ? `M ${radius}, ${radius} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
          : describeArc(radius, radius, radius, index * angle, (index + 1) * angle);
        
        return <Path d={pathData} fill={color} />;
      };
      
      const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
      
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
        const d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
          "L", x, y,
          "Z"
        ].join(" ");
      
        return d;       
      }
      
      const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      
        return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
        };
      }
      
      const Wheel = ({ tasks }) => {
        const radius = 100;
        const angle = 360 / (tasks.length || 1);
      
        // Use tasks directly without reassigning colors
        return (
          <View style={styles.wheelContainer}>
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
              }}
            >
              <Svg height={wheelSize} width={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                <G transform={`translate(0, 0)`}>
                  {tasks.map((task, index) => (
                    <PieSlice
                      key={task.id}
                      color={task.color} // Color is already assigned, use as is
                      angle={angle}
                      index={index}
                      tasksLength={tasks.length}
                    />
                  ))}
                </G>
              </Svg>
            </Animated.View>
            <Svg
              height={pointerSize}
              width={pointerSize}
              style={{
                position: 'absolute',
                top: radius - 50,
                left: radius - (pointerSize / 2),
              }}
            >
              <Polygon
                points={`${pointerSize / 2},0 0,${pointerSize} ${pointerSize},${pointerSize}`}
                // fill={winningColor} // Use the winning color for the pointer
                fill='black'
              />
            </Svg>
            <TouchableOpacity
              style={styles.spinButton}
              onPress={handleSpin}
              activeOpacity={1}
            >
              <Text style={styles.spinButtonText}>Spin</Text>
            </TouchableOpacity>
          </View>
        );
      };
      
      

      const handleSpin = () => {
        // Calculate the angle for each section
        // const sectionAngle = 360 / tasksForWheel.length;
      
        // Choose a random section to stop
        // const randomSection = Math.floor(Math.random() * tasksForWheel.length);
      
        const finalAngle = 900 + Math.random() * (2000 - 900);

        // Update the reference to the final angle for the next spin
        finalAngleRef.current = finalAngle;
        console.log(finalAngleRef.current);
      
        // Start the animation
        Animated.timing(spinValue, {
          toValue: finalAngle / 360,
          duration: 8000, 
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          // Set the winning task ID and color after the wheel stops
        //   const winningTask = tasksForWheel[randomSection];
        //   setWinningTaskId(winningTask.id);
        //   setWinningColor(winningTask.color);
        });
      };
    
    // Interpolate the spin value to create a rotation transform
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${finalAngleRef.current}deg`],
    });
  
      return (

        <View style={styles.container}>
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => {/* Logic for Profile */}}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
  
        <View style={styles.wheel}>
        <Wheel tasks={tasksForWheel} />
        </View>

      
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
            // <TouchableOpacity 
            //   key={task.id} 
            //   style={styles.taskItem}
            //   onPress={() => toggleTaskCompletion(task.id)}
            // >
            <View key={task.id} style={styles.taskItem}>
                        <CustomCheckbox taskId={task.id} />
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
            {/* </TouchableOpacity> */}
            </View>
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