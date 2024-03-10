export const getFirestore = jest.fn();
export const doc = jest.fn();
export const setDoc = jest.fn();
export const collection = jest.fn();
export const addDoc = jest.fn();

// Updated getDocs mock to return a promise resolving to a query snapshot-like structure
export const getDocs = jest.fn(() => Promise.resolve({
  docs: [
    {
      id: '1',
      data: () => ({
        task: 'Sample Task 1',
        completed: false,
        priority: 1,
      }),
    },
    {
      id: '2',
      data: () => ({
        task: 'Sample Task 2',
        completed: true,
        priority: 1,
      }),
    },
  ],
}));

export const updateDoc = jest.fn();
export const where = jest.fn();
export const query = jest.fn(); // Adding a mock for 'query'

export const firestore = {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  where,
  query, // Add query to the exported firestore object
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
