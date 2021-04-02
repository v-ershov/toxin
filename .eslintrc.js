module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    browser: true,
    jquery: true,
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-underscore-dangle': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/webpack.common.ts',
      },
    },
  },
};
