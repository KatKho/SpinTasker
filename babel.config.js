module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true
      }],
    ],
    overrides: [
      {
        include: ['./node_modules/@react-native'],
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      },
    ],
  };
};
