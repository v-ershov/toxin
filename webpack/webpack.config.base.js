const webpack = require('webpack');
const fs = require('fs');
const pugBem = require('pug-bem');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./webpack.paths.js');

module.exports = {
  entry: {
    app: [
      '@babel/polyfill',
      `${paths.src.js}/index.js`,
    ],
  },
  output: {
    path: paths.context.dist,
    publicPath: '/',
  },
  resolve: {
    alias: {
      '~': paths.context.src,
    },
  },
  stats: {
    children: false,
  },
  devServer: {
    open: true,
    overlay: true,
    port: 8095,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          plugins: pugBem,
          pretty: true,
          root: paths.context.src,
        },
      },
      {
        test: /\.(woff2?|ttf|svg|eot|otf)$/,
        include: paths.src.fonts,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'fonts',
        },
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        include: paths.src.content,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'images/content',
        },
      },
      {
        test: /\.(woff2?|ttf|svg|eot|otf|jpe?g|png|gif)$/,
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
