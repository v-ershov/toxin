const merge = require('webpack-merge');
const pugBem = require('pug-bem');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths.js');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          plugins: [pugBem],
          root: paths.context.src,
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: paths.postcss.prod,
              },
            },
          },
          'sass-loader',
          'import-glob-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
});
