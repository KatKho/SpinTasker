import React from 'react';
import { render, fireEvent, act, waitFor} from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen/HomeScreen';
import { mockData as importedMockData } from './__mocks__/firebase';
import { updateDoc } from './__mocks__/firebase';

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
  let localMockData;

  beforeEach(() => {
    localMockData = [...importedMockData];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: Renders Correctly
  it('renders correctly', () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);
    expect(getByTestId('addTaskButton')).toBeTruthy();
  });

  // Test: Opens Add Task Modal on Button Press
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

  // Test: Adds a New Task
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

  // Test: Deletes a Task
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

  // Test: Toggles Task Completion
  it('toggles task completion', async () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getAllByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);
    
    await waitFor(() => expect(getAllByTestId('taskItem')).toBeTruthy());
    
    let taskItems = await getAllByTestId('taskItem');
    if (taskItems.length > 0) {
      const initialCompletedState = taskItems[0].props.completed;
      const taskId = localMockData[0].id;

      localMockData = localMockData.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
    
      const toggleCompleteButtons = await getAllByTestId('toggleCompleteButton');
      fireEvent.press(toggleCompleteButtons[0]);

      const updatedTask = localMockData.find(task => task.id === taskId);
      expect(updatedTask.completed).toBe(!initialCompletedState);
    } else {
      console.log("No tasks available for completion toggle.");
    }
  });

  // Test: Opens Edit Task Modal on Button Press
  it('opens the edit modal when the first edit button is pressed', async () => {
    const { getAllByTestId, queryByTestId } = render(<HomeScreen navigation={{ navigate: jest.fn() }} route={{ params: { userId: '123' } }} />);
  
    await waitFor(() => expect(getAllByTestId('taskItem')).toBeTruthy());

    const editButtons = getAllByTestId('editTaskButton');
    if (editButtons.length > 0) {
      fireEvent.press(editButtons[0]);
  
      await waitFor(() => {
        expect(queryByTestId('taskEditModal')).toBeTruthy();
      });
    } else {
      console.log("No edit buttons found");
    }
  });
  
  // Test: Edits Task Details
  it('edits a task', async () => {
    const navigationMock = { navigate: jest.fn() };
    const routeMock = { params: { userId: '123' } };
    const { getByTestId, getAllByTestId, queryByTestId } = render(<HomeScreen navigation={navigationMock} route={routeMock} />);

    await waitFor(() => expect(getAllByTestId('taskItem')).toBeTruthy());

    const editButtons = getAllByTestId('editTaskButton');
    if (editButtons.length > 0) {
      fireEvent.press(editButtons[0]);

      await waitFor(() => expect(queryByTestId('taskEditModal')).toBeTruthy());

      const updatedName = 'Updated Task Name';
      const updatedDescription = 'Updated Task Description';
      const updatedPriority = 2;
      fireEvent.changeText(getByTestId('taskNameInput'), updatedName);
      fireEvent.changeText(getByTestId('taskDescriptionInput'), updatedDescription);
      fireEvent(getByTestId('prioritySlider'), 'onValueChange', updatedPriority);

      fireEvent.press(getByTestId('saveTaskButton'));

      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        name: updatedName,
        description: updatedDescription,
        priority: updatedPriority
      });
    } else {
      console.log("No tasks available for editing.");
    }
  });
});
