import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './profileStyles';
import { app } from '../../firebase/config'; 

const Profile = ({ navigation, userUID }) => {
  const auth = getAuth();
  const db = getFirestore(app);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [taskStatistics, setTaskStatistics] = useState({ completed: 0, pending: 0 });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || 'No email available');
      loadTaskStatistics();
    }
  }, [auth.currentUser, isModalVisible]);

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
  
  const InfoRow = ({ icon, text }) => (
    <View style={styles.infoRow}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={require('../../../assets/pers.png')} 
          style={styles.profile}
        />
      </TouchableOpacity>


      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitleText}>Profile Details</Text>
          <InfoRow 
            icon={require('../../../assets/mail.png')} 
            text={`Email: ${userEmail}`} 
          />
          <InfoRow 
            icon={require('../../../assets/yesyes.png')} 
            text={`Completed tasks: ${taskStatistics.completed}`} 
          />
          <InfoRow 
            icon={require('../../../assets/sad.png')} 
            text={`Pending tasks: ${taskStatistics.pending}`} 
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
