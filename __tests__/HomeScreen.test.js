import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native'; 
import HomeScreen from '../src/screens/HomeScreen/HomeScreen';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  initializeAuth: jest.fn(() => ({})),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: 'KeyboardAwareScrollView'
}));

jest.mock('firebase/firestore', () => require('./__mocks__/firebase'));

jest.mock('@react-native-async-storage/async-storage', () => jest.fn());

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);
    expect(getByTestId('addTaskButton')).toBeTruthy();
  });

  it('opens add task modal on button press', async () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId, queryByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);

    expect(queryByTestId('taskModal')).toBeNull();
  
    await act(async () => {
      fireEvent.press(getByTestId('addTaskButton'));
    });

    expect(getByTestId('taskModal')).toBeTruthy();
  });
});
