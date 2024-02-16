import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, TouchableOpacity, Modal, TextInput, Button, Easing, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
import styles from './styles';
import { app } from '../../firebase/config'; 
import Svg, { Path, G, Polygon, Text as SVGText } from 'react-native-svg';
import { Animated } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const auth = getAuth();
  const db = getFirestore(app);
  const userUID = route.params?.userId;
  const spinValue = useRef(new Animated.Value(0)).current;
  const pointerSize = 30;
  const wheelSize = 200;
  const finalAngleRef = useRef(0);

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
  const [isFirstSpin, setIsFirstSpin] = useState(true);

  const tasksForWheel = allTasks.filter(task => selectedTasks.includes(task.id));
//   const baseColors = [
//     '#FFC0CB', // Pink
//     // '#FFDAB9', // Peach Puff
//     '#E6E6FA', // Lavender
//     '#D8BFD8', // Thistle
//     '#DEB887', // Burlywood
//     '#EEE8AA', // Pale Golden Rod
//     '#F0E68C', // Khaki
//     '#F5DEB3', // Wheat
//     '#F5F5DC', // Beige
//     '#FAFAD2', // Light Golden Rod Yellow
//     '#FFF0F5', // Lavender Blush
//     '#FFE4E1', // Misty Rose
//     '#FFEFD5', // Papaya Whip
//     '#FFF5EE', // Sea Shell
//     '#FFFACD'  // Lemon Chiffon
//   ];


// Function to fetch tasks from Firestore
const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userUID));
      const querySnapshot = await getDocs(q);
      const tasksWithColors = querySnapshot.docs.map((doc, index) => {
        const taskData = doc.data();
        // const colorIndex = index % baseColors.length; 
        // taskData.color = taskData.color || baseColors[colorIndex];
        taskData.color = taskData.color || getRandomColor('pastel');
        return {
          id: doc.id,
          ...taskData
        };
      });
      setAllTasks(tasksWithColors); // Update the tasks with colors
    //   updateDisplayedTasks(selectedDate);
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
      setTaskName('');
      setTaskDescription('');
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

    const usedHues = new Set();

    const getRandomColor = (theme) => {
        let hue;
        let saturation;
        let lightness;
        
        // Attempt to find a unique hue that hasn't been used
        do {
            switch(theme) {

                case 'pastel':
                    // Pastel colors: high lightness and saturation
                    hue = Math.random() * 360; // Full range of hues
                    break;
                default:
                    // Default to full range of hues
                    hue = Math.random() * 360;
            }
        } while (usedHues.has(Math.floor(hue))); // Continue if the hue has been used
        usedHues.add(Math.floor(hue)); // Add the hue to the set of used hues
    
        // Define saturation and lightness based on the theme
        if (theme === 'pastel') {
            saturation = Math.random() * (100 - 60) + 60; // Saturation between 60% and 100%
            lightness = Math.random() * (100 - 80) + 80; // Lightness between 80% and 100%
        } else {
            saturation = Math.random() * 100;
            lightness = 50;
        }
    
        return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(lightness)}%)`;
    };

    const resetUsedHues = () => {
        usedHues.clear();
    };

      const PieSlice = ({ color, angle, index, tasksLength, task }) => {
        const radius = 100;
        const pathData = tasksLength === 1
          ? `M ${radius}, ${radius} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
          : describeArc(radius, radius, radius, index * angle, (index + 1) * angle);
        return (
        <G>
      <Path d={pathData} fill={color} />
       </G>
          );
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
      
        // Define the spin animation
        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `360deg`],
          });
        
      
        return (
          <View style={styles.wheelContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg height={wheelSize} width={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                <G transform={`translate(0, 0)`}>
                  {tasks.map((task, index) => (
                    <PieSlice
                      key={task.id}
                      task={task}
                      color={task.color}
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
                fill='black' // Use black for the pointer
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
        console.log("Spin clicked");
        spinValue.setValue(0); // Reset the spin value to 0
    
        const fullRotations = 1 + Math.floor(Math.random() * 6);
        console.log(fullRotations);
        const randomDegrees = Math.random() * 360;
        const visualFinalAngle = fullRotations * 360 + randomDegrees;
    
        finalAngleRef.current = visualFinalAngle % 360;
    
        console.log(`Starting animation with final angle: ${finalAngleRef.current}`);
    
        Animated.timing(spinValue, {
          toValue: visualFinalAngle / 360,
          duration: 5000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          console.log("Animation completed");
    
        //   Calculate the index of the section the pointer is pointing to
        if (tasksForWheel.length === 0) {
            Alert.alert("No Tasks", "There are no tasks to select.");
            return; // Exit the function if there are no tasks
          }
          const numberOfSections = tasksForWheel.length;
          const sectionAngle = 360 / numberOfSections;
          let winningIndex = Math.floor(finalAngleRef.current / sectionAngle);
          winningIndex = numberOfSections - (winningIndex + 1); // Adjust for the array indexing
      
          // Set the winning task based on the winning index
          const winningTask = tasksForWheel[winningIndex];
      
          // Delay setting the state until after the alert is closed
          Alert.alert("Winner", `It is time to: ${winningTask.name}`, [
            {
              text: "OK",
              onPress: () => {
                setWinningTaskId(winningTask.id);
                setWinningColor(winningTask.color);
              },
            },
          ]);
        });
      };
      useEffect(() => {
        // console.log("Selected tasks: ", selectedTasks);
        if (isFirstSpin && selectedTasks.length > 0) {
          console.log("Initial spin triggered.");
        //   handleSpin();
          setIsFirstSpin(false); 
        }
      }, [selectedTasks]);
    

      return (

        <View style={styles.container}>
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => {/* Logic for Profile */}}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
  
        <View style={styles.wheel}>
                    {
            tasksForWheel.length > 0 ? (
                <Wheel tasks={tasksForWheel} />
            ) : (
                <View style={styles.placeholderContainer}>
                <Image
                    source={require('../../../assets/icon.png')}
                    style={styles.logo}
                />
                </View>
            )
            }
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
            <View
            key={task.id}
            style={[
              styles.taskItem,
              { backgroundColor: selectedTasks.includes(task.id) ? task.color : 'transparent' } // Apply the color here
            ]}
          >
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
