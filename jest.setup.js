import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
global.alert = jest.fn();

global.window = global.window || { navigator: { userAgent: 'ReactNative' } };
