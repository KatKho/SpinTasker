import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Login logic here

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title="Log In" 
        onPress={() => {
          // Handle the login logic here
          navigation.navigate('MainDashboard');
        }} 
      />
      <Text 
        style={styles.textButton}
        onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot password?
      </Text>
      <Text 
        style={styles.textButton}
        onPress={() => navigation.navigate('Signup')}>
        Create new account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  textButton: {
    marginTop: 10,
    color: 'blue',
  },
});

export default LoginScreen;
