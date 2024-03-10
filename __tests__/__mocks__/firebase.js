export const getFirestore = jest.fn();
export const doc = jest.fn();
export const setDoc = jest.fn();
export const collection = jest.fn();
export const addDoc = jest.fn(() => {
  return Promise.resolve({ id: 'mock-doc-id' });
});

export const getDocs = jest.fn(() => Promise.resolve({
  docs: [
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
  ],
}));


export const updateDoc = jest.fn();
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
