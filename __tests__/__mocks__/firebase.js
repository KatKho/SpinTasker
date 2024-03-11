export const mockData = [
  {
    id: '1',
    data: () => ({
      name: 'Sample Task 1', 
      description: 'Description for Task 1', 
      completed: false,
      priority: 1,
      date: new Date().toISOString(),
    }),
  },
  {
    id: '2',
    data: () => ({
      name: 'Sample Task 2', 
      description: 'Description for Task 2', 
      completed: true,
      priority: 1,
      date: new Date().toISOString(),
    }),
  },
];

export const getFirestore = jest.fn();
export const doc = jest.fn((_, id) => ({ id }));
export const setDoc = jest.fn();
export const collection = jest.fn();
export const addDoc = jest.fn(() => {
  const newId = 'mock-doc-id'; 
  mockData.push({
    id: newId,
    data: () => ({
      name: 'New Task',
      description: 'Description for New Task',
      completed: false,
      priority: 1,
      date: new Date().toISOString(),
    }),
  });
  return Promise.resolve({ id: newId });
});
export const getDocs = jest.fn(() => Promise.resolve({ docs: mockData }));
export const updateDoc = jest.fn((docRef, updatedFields) => {
  const docIndex = mockData.findIndex(doc => doc.id === docRef.id);
  if (docIndex > -1) {
    mockData[docIndex].data = () => ({
      ...mockData[docIndex].data(),
      ...updatedFields
    });
  }
  return Promise.resolve();
});

export const deleteDoc = jest.fn((docRef) => {
  const docIndex = mockData.findIndex(doc => doc.id === docRef.id);
  if (docIndex > -1) {
    mockData.splice(docIndex, 1);
  }
  return Promise.resolve();
});
export const where = jest.fn();
export const query = jest.fn();

export const firestore = {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  where,
  query,
};

export const auth = jest.fn();
export const getAuth = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const initializeAuth = jest.fn();
export const getReactNativePersistence = jest.fn();

const firebase = {
  auth,
  firestore,
  getAuth,
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
};

export default firebase;

test('dummy test', () => {
  expect(true).toBe(true);
});
