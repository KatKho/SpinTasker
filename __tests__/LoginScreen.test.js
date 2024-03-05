jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };
  });

  
import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen/LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
  });
});
