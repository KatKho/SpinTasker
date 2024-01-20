// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = getAuth(app);

// Get a reference to the database service
const db = getFirestore(app);

export { auth, db };
