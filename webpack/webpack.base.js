const webpack = require('webpack');
const fs = require('fs');
const pugBem = require('pug-bem');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
  devServer: {
    open: true,
    overlay: true,
    port: 8095,
    writeToDisk: true,
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
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          plugins: pugBem,
          pretty: true,
          root: paths.context.src,
        },
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: paths.postcss.dev,
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                `${paths.src.scss}/_functions.scss`,
                `${paths.src.scss}/_vars.scss`,
                `${paths.src.scss}/_mixins.scss`,
              ],
            },
          },
        ],
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
        test: /\.(woff2?|ttf|svg|eot|otf)$/,
        include: paths.src.fonts,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'fonts',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot|otf)$/,
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
