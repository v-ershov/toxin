module.exports = { 
  extends: 'airbnb-base',
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'webpack/webpack.common.js',
      },
    },
  },
};
