import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
// import SignupScreen from '../screens/SignupScreen';
import MainDashboard from '../screens/MainDashboard';

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
      <Stack.Screen name="Main" component={MainDashboard} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
