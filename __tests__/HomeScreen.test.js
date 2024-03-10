import React from 'react';
import { render, fireEvent, act, waitFor, debug } from '@testing-library/react-native'; 
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

  it('adds a new task', async () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId, queryByTestId, getAllByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);
  
    await waitFor(() => expect(getAllByTestId('taskItem')).toBeTruthy());
  
    const initialTaskCount = getAllByTestId('taskItem').length;
  
    fireEvent.press(getByTestId('addTaskButton'));
    await waitFor(() => expect(queryByTestId('taskModal')).toBeTruthy());
    fireEvent.changeText(getByTestId('taskNameInput'), 'New Task');
    fireEvent.changeText(getByTestId('taskDescriptionInput'), 'Description of new task');
    fireEvent.press(getByTestId('addTaskConfirmButton'));
  
    await waitFor(() => {
      const updatedTaskCount = getAllByTestId('taskItem').length;
      expect(updatedTaskCount).toBeGreaterThan(initialTaskCount);
    }, { timeout: 5000 });
  });

  it('deletes a task', async () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId, getAllByTestId, queryByTestId, queryAllByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);
  
     await waitFor(() => expect(getAllByTestId('taskItem')).toBeTruthy());

     const initialTaskCount = getAllByTestId('taskItem').length;

     if (initialTaskCount > 0) {
       const firstDeleteButton = getAllByTestId('deleteTaskButton')[0];
       fireEvent.press(firstDeleteButton);
   
       await waitFor(() => {
         const updatedTasks = queryAllByTestId('taskItem');
         return expect(updatedTasks.length).toBeLessThan(initialTaskCount);
       }); 
     } else {
       console.log("No tasks available to delete.");
     }
   });
  
  
  
  
});
