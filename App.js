import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {decode, encode} from 'base-64'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator >
        { user ? (
          <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          initialParams={{ userId: user?.uid }} 
          options={{
            headerStyle: {
              backgroundColor: '#efefef'
            },
          }}
        />     
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} 
             options={{
              headerStyle: {
                backgroundColor: '#efefef'
              },
            }}/>
            <Stack.Screen name="Registration" component={RegistrationScreen} 
             options={{
              headerStyle: {
                backgroundColor: '#efefef'
              },
            }}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
