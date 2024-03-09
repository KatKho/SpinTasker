export const getFirestore = jest.fn();
export const doc = jest.fn();
export const setDoc = jest.fn();
export const firestore = {
  getFirestore,
  doc,
  setDoc
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
  getReactNativePersistence
};

export default firebase;

test('dummy test', () => {
  expect(true).toBe(true);
});
