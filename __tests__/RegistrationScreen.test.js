import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import RegistrationScreen from '../src/screens/RegistrationScreen/RegistrationScreen';
import firebase from 'firebase';

global.alert = jest.fn();

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
    initializeAuth: jest.fn(),
    getReactNativePersistence: jest.fn(),
  };
});

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    KeyboardAwareScrollView: jest.fn(({ children }) => <View>{children}</View>)
  };
});

jest.mock('firebase/firestore', () => require('./__mocks__/firebase')); 


describe('RegistrationScreen', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });
  // Test for rendering the component
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<RegistrationScreen />);
    
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Create account')).toBeTruthy();
  });

  // Test state updates on text input
  it('updates name, email, password, and confirm password states on change', () => {
    const { getByPlaceholderText } = render(<RegistrationScreen />);
    const nameInput = getByPlaceholderText('Name');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.changeText(confirmPasswordInput, 'password');
  });

  // Test for registration functionality
  it('calls createUserWithEmailAndPassword and sets user data on registration button press', async () => {
    const { getByText, getByPlaceholderText } = render(<RegistrationScreen />);
  
    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password');
    fireEvent.press(getByText('Create account'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'test@example.com', 'password');
    });
  });
 // Test for password mismatch
  it('displays an alert when passwords do not match', () => {
    const { getByText, getByPlaceholderText } = render(<RegistrationScreen />);
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});
    fireEvent.changeText(getByPlaceholderText('Password'), 'password1');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password2');
    fireEvent.press(getByText('Create account'));
    expect(alertMock).toHaveBeenCalledWith("Passwords don't match.");
    alertMock.mockRestore();
  });

//   it('navigates to home screen on successful registration', async () => {
//     const { getByText, getByPlaceholderText } = render(<RegistrationScreen />);
//     const mockNavigate = jest.fn();
    
//     // Mock firestore functions
//     jest.spyOn(firebase.firestore, 'doc').mockReturnValueOnce(jest.fn());
//     jest.spyOn(firebase.firestore, 'setDoc').mockResolvedValueOnce();
    
//     fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
//     fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'password');
//     fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password');
    
//     fireEvent.press(getByText('Create account'));
  
//     await waitFor(() => {
//       // Verify that navigation was called
//       console.log('Navigation calls:', mockNavigate.mock.calls);
//       expect(mockNavigate).toHaveBeenCalled();
    
//       // Check if the first argument passed to navigation is 'Home'
//       const navigationCalls = mockNavigate.mock.calls;
//       if (navigationCalls.length > 0) {
//         console.log('First argument of navigation:', navigationCalls[0][0]);
//         expect(navigationCalls[0][0]).toBe('Home');
//       } else {
//         console.log('Navigation was not called.');
//       }
//     });
// });
  
  // Test for navigation to login screen
  it('navigates to login screen on footer link press', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<RegistrationScreen navigation={{ navigate: mockNavigate }} />);
    
    fireEvent.press(getByText('Log in'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
