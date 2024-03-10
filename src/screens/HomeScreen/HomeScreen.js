import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, TouchableOpacity,TextInput, Button, Easing, Alert, Image, TouchableHighlight, InteractionManager } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-native-modal';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
import styles from './styles';
import { app } from '../../firebase/config'; 
import Svg, { Path, G, Polygon, Text as SVGText} from 'react-native-svg';
import { Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Profile from './Profile';
import { Calendar } from 'react-native-calendars';
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export default function HomeScreen({ navigation, route }) {
  const auth = getAuth();
  const db = getFirestore(app);
  const userUID = route.params?.userId;
  const spinValue = useRef(new Animated.Value(0)).current;
  const pointerSize = 30;
  const wheelSize = 200;
  const finalAngleRef = useRef(0);

  const [selectedDateString, setSelectedDateString] = useState(formatDateToString(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState(1);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isFirstSpin, setIsFirstSpin] = useState(true);
  const [selectedTaskColors, setSelectedTaskColors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const tasksForWheel = allTasks.filter(task => selectedTasks.includes(task.id));
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];
  const defaultTasks = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
    { id: 3, name: 'Task 3' },
    { id: 4, name: 'Task 4' }
  ];

// Function to fetch tasks from Firestore
const fetchTasks = async () => {
    try {
        const q = query(collection(db, "tasks"), where("userId", "==", userUID));
        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })).sort((a, b) => b.priority - a.priority);
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
  
    // Sort tasks by completion status (uncompleted first) and then by priority (high to low)
    const sortedTasks = filteredTasks.sort((a, b) => {
      if (a.completed === b.completed) {
        return b.priority - a.priority; // Sort by priority if completion status is the same
      }
      return a.completed ? 1 : -1; // Uncompleted tasks first
    });
  
    setDisplayedTasks(sortedTasks);
  };

// Function to add a task
const addTask = async () => {
    const trimmedTaskName = taskName.trim();
    if (!trimmedTaskName) {
      Alert.alert("Alert", "Please enter the task name or cancel");
      return; 
    }
    const newTask = {
      userId: userUID,
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      completed: false,
      date: selectedDate.toISOString(),
    };
  
    const tasksRef = collection(db, 'tasks');
    try {
      const docRef = await addDoc(tasksRef, newTask);
      const newTaskWithId = { ...newTask, id: docRef.id };
    setAllTasks(prevTasks => [...prevTasks, newTaskWithId]);
    updateDisplayedTasks(selectedDate);
    } catch (error) {
      console.error('Error adding task: ', error);
    }

    setTaskName('');
    setTaskDescription('');
    setTaskPriority(1);
    setIsTaskModalVisible(false);
  };
  
  // Function to handle date change
  const handleDayPress = (day) => {
    const newSelectedDate = new Date(day.dateString + 'T00:00:00');
    setSelectedDate(newSelectedDate);
    setSelectedDateString(day.dateString); 
    setShowCalendar(false);
    updateDisplayedTasks(newSelectedDate);

    setSelectedTasks([]);
  };

// Toggle task completion
const toggleTaskCompletion = async (taskId, rowMap, rowKey) => {
  const task = allTasks.find(t => t.id === taskId);
  if (task) {
    const taskRef = doc(db, "tasks", taskId);
    try {
      // Updates the task in the database
      await updateDoc(taskRef, {
        completed: !task.completed
      });
      // Updates the task locally in allTasks state
      setAllTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
      updateDisplayedTasks(selectedDate);
      closeRow(rowMap, rowKey);
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
      // Update allTasks state locally
      setAllTasks(prevTasks => prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updatedData } : task
      ));
      updateDisplayedTasks(selectedDate);
  } catch (error) {
      console.error('Error updating task: ', error);
  }
};
  
  // Function to delete a task
  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
        await deleteDoc(taskRef);
        // Update allTasks state locally
        setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        updateDisplayedTasks(selectedDate);
    } catch (error) {
        console.error('Error deleting task: ', error);
    }
};
  
// Function to handle updating a task
const handleUpdateTask = async () => {
  if (currentTask) {
      const trimmedTaskName = taskName.trim();
      if (!trimmedTaskName) {
          Alert.alert("Alert", "Please enter the task name");
          return;
      }

      await updateTask(currentTask.id, { 
          name: trimmedTaskName, 
          description: taskDescription, 
          priority: taskPriority 
      });

      setIsEditModalVisible(false);
      setCurrentTask(null);
      setTaskName('');
      setTaskDescription('');
  }
};

  const showCalendarModal = () => {
      setShowCalendar(true); 
    };
  
  const hideCalendar = () => {
    setShowCalendar(false);
  };


  const toggleTaskModal = () => {
    InteractionManager.runAfterInteractions(() => {
      setTaskName('');
      setTaskDescription('');  
      setTaskPriority(1);       
  setIsTaskModalVisible(!isTaskModalVisible);
    });
  };
      
  const showEditModal = (task, rowMap, rowKey) => {
    setCurrentTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description.toString());
    setTaskPriority(task.priority);
    setIsEditModalVisible(true);
    closeRow(rowMap, rowKey);
  };
      
  // Function to handle selection for the wheel, with color assignment
  const handleSelectForWheel = (taskId, rowMap, rowKey) => {
    let newSelectedTasks = [...selectedTasks];
    let taskIndexInSelected = selectedTasks.findIndex(id => id === taskId);
  
    if (taskIndexInSelected === -1) {
      newSelectedTasks.push(taskId);
      let nextColorIndex = (newSelectedTasks.length - 1) % colors.length;
      setSelectedTaskColors(prevColors => ({
        ...prevColors,
        [taskId]: colors[nextColorIndex]
      }));
    }
    else {
      newSelectedTasks.splice(taskIndexInSelected, 1);
      setSelectedTaskColors(prevColors => {
        const newColors = {...prevColors};
        delete newColors[taskId];
        return newColors;
      });
    }
  
    setSelectedTasks(newSelectedTasks);
    closeRow(rowMap, rowKey);
};

const assignColorsToDefaultTasks = () => {
  const defaultTaskColors = {};
  defaultTasks.forEach((task, index) => {
    defaultTaskColors[task.id] = colors[index % colors.length];
  });
  setSelectedTaskColors(defaultTaskColors);
};

useEffect(() => {
  assignColorsToDefaultTasks();
}, []);



const PieSlice = ({ color, angle, index, tasksLength, task }) => {
  const strokeWidth = 2; 
  const radius = 100;
  const adjustedRadius = radius - strokeWidth / 2;       
  const pathData = tasksLength === 1
  ? `M ${radius}, ${radius} m -${adjustedRadius}, 0 a ${adjustedRadius},${adjustedRadius} 0 1,0 ${adjustedRadius * 2},0 a ${adjustedRadius},${adjustedRadius} 0 1,0 -${adjustedRadius * 2},0`
  : describeArc(radius, radius, adjustedRadius, index * angle, (index + 1) * angle);

  return (
  <G>
<Path d={pathData} fill={color} 
  stroke="#FFFFFF" 
  strokeWidth={2} />
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
  const angle = 360 / (tasks.length || 1);
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
              color={selectedTaskColors[task.id]} 
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
          style={styles.pointer} 
          >
          <Polygon
              points={`${pointerSize / 2},0 0,${pointerSize} ${pointerSize},${pointerSize}`}
              fill='white' 
          />
          </Svg>
      <TouchableOpacity
        style={styles.spinButton}
        onPress={handleSpin}
        activeOpacity={1}
      >
        <Text style={styles.spinButtonText}>SPIN</Text>
      </TouchableOpacity>
    </View>
  );
};


const handleSpin = () => {
  // console.log("Spin clicked");
  spinValue.setValue(0);

  const fullRotations = 1 + Math.floor(Math.random() * 6);
  // console.log(fullRotations);
  const randomDegrees = Math.random() * 360;
  const visualFinalAngle = fullRotations * 360 + randomDegrees;

  finalAngleRef.current = visualFinalAngle % 360;

  // console.log(`Starting animation with final angle: ${finalAngleRef.current}`);

  Animated.timing(spinValue, {
    toValue: visualFinalAngle / 360,
    duration: 5000,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start(() => {

  //   Calculate the index of the section the pointer is pointing to
  if (tasksForWheel.length === 0) {
    Alert.alert("", "Select your tasks and spin again!", [
      {
        text: "OK",
        onPress: () => {
          spinValue.setValue(0);
        },
      },
    ]);
    return; 
  }
    const numberOfSections = tasksForWheel.length;
    const sectionAngle = 360 / numberOfSections;
    let winningIndex = Math.floor(finalAngleRef.current / sectionAngle);
    winningIndex = numberOfSections - (winningIndex + 1); 
    const winningTask = tasksForWheel[winningIndex];

    Alert.alert(`${winningTask.name}`, "", [
      {
        text: "OK",
        onPress: () => {
          spinValue.setValue(0); 
        },
      },
    ]);
  });
};
useEffect(() => {

  if (isFirstSpin && selectedTasks.length > 0) {
    setIsFirstSpin(false); 
  }
}, [selectedTasks]);

// Helper function to close a row
const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      // console.log(`Closing row: ${rowKey}`);
      rowMap[rowKey].closeRow();
    }
  };

const renderItem = (data, rowMap) => (
  <TouchableHighlight
  testID="taskItem" 
  style={[
    styles.rowFront,
    { 
      backgroundColor: selectedTasks.includes(data.item.id) ? selectedTaskColors[data.item.id] || '#ffddd1' : '#ffddd1',
      borderColor: selectedTasks.includes(data.item.id) ? selectedTaskColors[data.item.id] || '#ffddd1' : '#ffddd1',
      borderWidth: 2,
    }
  ]}
  underlayColor={'#AAA'}
>
       <View style={styles.rowFrontContainer}>
        {data.item.completed ? (
        <Image
        source={require('../../../assets/done.png')}
        style={styles.taskLogo}
    />
      ) :<Image
      source={require('../../../assets/no.png')}
      style={styles.taskLogo}
  />}
        <Text style={styles.taskText}>{data.item.name}</Text>
      </View>
    </TouchableHighlight>
  );
  
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => toggleTaskCompletion(data.item.id, rowMap, data.item.id)}
      >
    {/* <a href="https://www.flaticon.com/free-icons/goal" title="goal icons">Goal icons created by Freepik - Flaticon</a> */}
        <Image
      source={require('../../../assets/goal.png')}
      style={styles.taskLogo}
  />
        <Text style={styles.backTextWhite}>Complete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnCenter]}
        onPress={() => showEditModal(data.item, rowMap, data.item.id)}
      >
      {/* <a href="https://www.flaticon.com/free-icons/settings" title="settings icons">Settings icons created by srip - Flaticon</a> */}
        <Image
            source={require('../../../assets/settings.png')}
            style={styles.taskLogo}
        />
        <Text style={styles.backTextWhite}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteTaskButton"
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteTask(data.item.id)}
      >
                <Image
      source={require('../../../assets/trash1.png')}
      style={styles.taskLogo}
  />
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.backRightBtn, styles.backRightBtnRightLast]}
      onPress={() => handleSelectForWheel(data.item.id, rowMap, data.item.id)}
    >
   {/* <a href="https://www.flaticon.com/free-icons/wheel-of-fortune" title="wheel of fortune icons">Wheel of fortune icons created by Freepik - Flaticon</a> */}
    <Image
      source={require('../../../assets/wheel-of-fortune.png')}
      style={styles.taskLogo}
  />
      <Text style={styles.backTextWhite}>Add</Text>
    </TouchableOpacity>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return '#6BCB77'; // Low priority
      case 2:
        return '#FFD93D'; // Medium priority
      case 3:
        return '#FF6B6B'; // High priority
      default:
        return 'grey'; // Default color
    }
  };

      return (

        <View style={styles.container}>
         <Profile 
        navigation={navigation} 
        userUID={userUID} 
        onRefreshTasks={fetchTasks}
        />
  
        <View style={styles.wheel}>
                    {
            tasksForWheel.length > 0 ? (
                <Wheel tasks={tasksForWheel} />
            ) : (
              <Wheel tasks={defaultTasks} />
            )
            }
        </View>
      
        <TouchableOpacity onPress={showCalendarModal} style={styles.dateDisplay}>
        <View style={styles.dateTextContainer}>
            <Image
            source={require('../../../assets/calendar1.png')}
            style={styles.calendarIcon}
            />
           <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            })}
            </Text>
        </View>
        </TouchableOpacity>
        
        <Modal
        isVisible={showCalendar}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setShowCalendar(false)} 
        onBackButtonPress={() => setShowCalendar(false)} 
        backdropOpacity={0.7} 
        style={{ margin: 0, justifyContent: 'flex-end' }} 
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
      >
    <View style={styles.centeredViewCalendar}>
      <View style={styles.calendarModal}>
      <Calendar
        current={selectedDateString}
        onDayPress={handleDayPress}
        style={styles.calendar}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={hideCalendar}
        >
          <Text style={styles.confirmButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
              
  <View style={styles.taskList}>
      {displayedTasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
          <Image  source={require('../../../assets/relax.png')} style={styles.noTasksImage} />
        </View>
      ) : (
        <SwipeListView
          data={displayedTasks}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id.toString()}
          rightOpenValue={-300}
          disableRightSwipe={true}
        />
      )}

    
        <Modal
      isVisible={isEditModalVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={() => setIsEditModalVisible(false)} 
      onBackButtonPress={() => setIsEditModalVisible(false)} 
      backdropOpacity={0.7} 
      style={{ margin: 0, justifyContent: 'flex-end' }} 
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
    >
      <KeyboardAwareScrollView 
    resetScrollToCoords={{ x: 0, y: 0 }}
    scrollEnabled={true}
    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
  >
    <View style={styles.centeredView}>
      <View style={styles.taskModal}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#ddd"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#ddd"
          value={taskDescription}
          onChangeText={setTaskDescription}
        />
          <Text style={{ color: getPriorityColor(taskPriority), fontWeight: 'bold' }}>
        Priority: {taskPriority === 1 ? 'Low' : taskPriority === 2 ? 'Medium' : 'High'}
        </Text>
        <Slider
          value={taskPriority}
          onValueChange={value => setTaskPriority(value)}
          maximumValue={3}
          minimumValue={1}
          step={1}
          orientation="vertical"
          thumbTintColor={getPriorityColor(taskPriority)} 
          minimumTrackTintColor={getPriorityColor(taskPriority)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateTask}
          >
            <Text style={styles.saveButtonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAwareScrollView>
  </Modal>
        </View> 
  <View style={styles.footer}>
        <TouchableOpacity 
        testID="addTaskButton"
      style={styles.addButton}
      onPress={toggleTaskModal}
    >
      <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    </View>
    <Modal
  isVisible={isTaskModalVisible}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  onBackdropPress={toggleTaskModal} 
  onBackButtonPress={toggleTaskModal} 
  backdropOpacity={0.7} 
  style={{ margin: 0, justifyContent: 'flex-end' }} 
  animationInTiming={500}
  animationOutTiming={500}
  backdropTransitionInTiming={500}
  backdropTransitionOutTiming={500}
  testID="taskModal"
>
<KeyboardAwareScrollView 
    resetScrollToCoords={{ x: 0, y: 0 }}
    scrollEnabled={true}
    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
  >
    <View style={styles.centeredView}>
      <View style={styles.taskModal}>
        <TextInput
          testID="taskNameInput"
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#ddd"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TextInput
          testID="taskDescriptionInput"
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#ddd"
          value={taskDescription}
          onChangeText={setTaskDescription}
        />
        <Text style={{ color: getPriorityColor(taskPriority), fontWeight: 'bold' }}>
        Priority: {taskPriority === 1 ? 'Low' : taskPriority === 2 ? 'Medium' : 'High'}
        </Text>
        <Slider
          testID="prioritySlider"
          value={taskPriority}
          onValueChange={value => setTaskPriority(value)}
          maximumValue={3}
          minimumValue={1}
          step={1}
          thumbTintColor={getPriorityColor(taskPriority)} 
          minimumTrackTintColor={getPriorityColor(taskPriority)}
        />
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      testID="addTaskConfirmButton"
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
    </KeyboardAwareScrollView>
  </Modal>
      </View>
    );
  };
