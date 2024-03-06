import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import LoginScreen from '../src/screens/LoginScreen/LoginScreen';

global.alert = jest.fn();

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  };
});

describe('LoginScreen', () => {
  // Test for rendering the component
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
  });

  // Test state updates on text input
  it('updates email and password states on change', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');

  });

  // Test for login functionality
  it('calls signInWithEmailAndPassword on login button press', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
  
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Log in'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'test@example.com', 'password');
  });

  // Test for navigation to registration screen
  it('navigates to registration screen on footer link press', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<LoginScreen navigation={{ navigate: mockNavigate }} />);
    
    fireEvent.press(getByText('Sign up'));

    expect(mockNavigate).toHaveBeenCalledWith('Registration');
  });

  // Test for forgot password functionality
  it('calls sendPasswordResetEmail on forgot password press', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'test@example.com');
    fireEvent.press(getByText('Forgot password?'))
    await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(getAuth(), 'test@example.com');
        expect(alert).toHaveBeenCalledWith('Password reset email sent! Check your inbox.');
      });
    });
    
   // Test for forgot password alert
   it('shows alert if no email is entered and forgot password is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Forgot password?'));

    expect(alert).toHaveBeenCalledWith('Please enter your email address to reset your password.');
  });
});
