const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loader: 'pug-loader',
        options: {
          root: common.externals.paths.input,
        },
      },
    ],
  },
});
