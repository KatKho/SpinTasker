module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/jest.transform.js',
    },
    globals: {
        'ts-jest': {
          babelConfig: true,
        },
      },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|react-native|@react-native-community|@react-native-picker|@firebase/.*|@react-native.*)',
      ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  };