import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import styles from './profileStyles';
import { app } from '../../firebase/config'; 
import InfoRow from './InfoRow';

const Profile = ({ navigation, userUID }) => {
  const auth = getAuth();
  const db = getFirestore(app);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [taskStatistics, setTaskStatistics] = useState({ completed: 0, pending: 0 });
  const [userName, setUserName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      loadUserDetails(user.uid);
      loadTaskStatistics();
    }
  }, [auth.currentUser, isModalVisible]);

  const loadUserDetails = async (uid) => {
    try {
      const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", uid)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setUserEmail(userData.email || 'No email available'); 
        setUserName(userData.fullName || 'No name available'); 
      }
    } catch (error) {
      console.error('Failed to load user details', error);
    }
  };
  
  const loadTaskStatistics = async () => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userUID));
      const querySnapshot = await getDocs(q);
      let completed = 0;
      let pending = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().completed) {
          completed++;
        } else {
          pending++;
        }
      });
      setTaskStatistics({ completed, pending });
    } catch (error) {
      console.error('Failed to load task statistics', error);
    }
  };

  const updateUserName = async (uid, newName) => {
    const userRef = doc(db, "users", uid); 
    try {
      await updateDoc(userRef, {
        fullName: newName, 
      });
      setUserName(newName); 
      setNewUserName('');
      setEditMode(false); 
      Alert.alert("Success", "Username updated successfully");
    } catch (error) {
      console.error('Failed to update user name', error);
      Alert.alert("Error", "Failed to update username");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); 
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getGreetingTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={require('../../../assets/pers.png')} 
          style={styles.profile}
        />
      </TouchableOpacity>
      {/* <Text style={{ marginLeft: 10, marginTop: 12 }}>
        {getGreetingTimeOfDay()}, {userName}!
      </Text> */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modal}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitleText}>Profile Details</Text>
  
          {/* Editable username row */}
          <InfoRow
            icon={require('../../../assets/username.png')}
            label="Username: "
            initialValue={userName}
            updateFunction={(newName) => updateUserName(userUID, newName)}
            editIcon={require('../../../assets/pencil.png')}
          />
  
          {/* Static info rows */}
          <InfoRow 
            icon={require('../../../assets/mail.png')} 
            label="Email: "
            initialValue={userEmail}
          />
          <InfoRow 
            icon={require('../../../assets/done.png')} 
            label="Completed tasks: "
            initialValue={`${taskStatistics.completed}`}
          />
          <InfoRow 
            icon={require('../../../assets/no.png')} 
            label="Pending tasks: "
            initialValue={`${taskStatistics.pending}`}
          />
  
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
  
};

export default Profile;
