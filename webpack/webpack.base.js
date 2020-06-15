const webpack = require('webpack');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths.js');
const helpers = require('./helpers.js');

helpers.createBlocksFile();

module.exports = {
  entry: {
    app: [
      '@babel/polyfill',
      `${paths.context.src}/index.js`,
    ],
  },
  output: {
    path: paths.context.dist,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    alias: {
      '~': paths.context.src,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(woff(2)?|ttf|svg|eot|otf)$/,
        include: paths.src.fonts,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'fonts',
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        include: paths.src.blocks,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images',
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        include: paths.src.content,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'images/content',
        },
      },
      {
        test: /\.(woff(2)?|ttf|svg|eot|otf|jpg|jpeg|png|gif)$/,
        include: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: (url, resourcePath) => {
            const path = resourcePath.split('\\');
            return `plugin-files/${path[path.indexOf('node_modules') + 1]}/${url}`;
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    ...fs.readdirSync(paths.src.pages).map((page) => new HtmlWebpackPlugin({
      filename: `${page.replace(/\.pug/, '.html')}`,
      template: `${paths.src.pages}/${page}`,
    })),
  ],
};
