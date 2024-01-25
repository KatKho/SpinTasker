
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBxUeHxRqdAxElUO0uskvKQgi6ZIgO2UcU',
  authDomain: 'todospi.firebaseapp.com',
  databaseURL: 'https://todospi-default-rtdb.firebaseio.com',
  projectId: 'todospi',
  storageBucket: 'todospi.appspot.com',
  messagingSenderId: '793504085772',
  appId: '1:793504085772:ios:429634912b96ff5665bb29',
};

window.navigator.userAgent = "ReactNative";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
