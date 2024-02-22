import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image } from 'react-native';
import Modal from 'react-native-modal';
import styles from './profileStyles'; // Assume your styles are defined here
import { getAuth, signOut } from 'firebase/auth';

const Profile = ({ navigation }) => {
  const auth = getAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as email, etc.
      const email = user.email || 'No email available';
      // You can set the userEmail in state
      setUserEmail(email);
    }
  }, [auth.currentUser]); // This effect will run when the component mounts and whenever the current user changes

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={require('../../../assets/person1.png')} // Your local image
          style={styles.profile}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        animationIn="slideInLeft" // Here we define the animation for sliding in from the left
        animationOut="slideOutLeft" // And similarly for sliding out to the left
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        swipeDirection={['left', 'right']} // Allow swiping to close either left or right
        style={styles.modal} // This is to ensure the modal comes in from the side
      >
        <View style={styles.modalContent}>
        <Text style={styles.userEmail}>{userEmail}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
          {/* <Button title="Close" onPress={toggleModal} /> */}
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
