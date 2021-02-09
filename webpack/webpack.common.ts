// https://webpack.js.org/configuration/configuration-languages/#typescript

import webpack from 'webpack';
import fs from 'fs';

// @ts-ignore
import pugBem from 'pug-bem';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import paths from './paths';

const config: webpack.Configuration = {
  entry: {
    app: [
      '@babel/polyfill',
      paths.src._index,
    ],
  },
  output: {
    path: paths.dist,
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
      '~': paths.src._,
    },
    extensions: ['.ts', '.js', '.sass', 'scss'],
  },
  stats: {
    children: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      {
        test: /\.(pug)$/,
        exclude: /node_modules/,
        loader: 'pug-loader',
        options: {
          plugins: [pugBem],
          pretty: true,
          root: paths.src._,
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        include: paths.src.assets.content,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'assets/images/content',
        },
      },
      {
        test: /\.(woff2?|ttf|svg|eot|otf)$/,
        include: paths.src.assets.fonts,
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: 'assets/fonts',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot|otf)$/,
        include: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: (url: string, resourcePath: string): string => {
            const split = resourcePath.split('\\');
            return `modules-files/${split[split.indexOf('node_modules') + 1]}/${url}`;
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CleanWebpackPlugin(),
    ...fs.readdirSync(paths.src.pug.pages).map((page) => new HtmlWebpackPlugin({
      filename: `${page.replace(/\.pug/, '.html')}`,
      template: `${paths.src.pug.pages}/${page}`,
    })),
    new FaviconsWebpackPlugin({
      logo: paths.src.assets.favicons._fav,
      outputPath: 'assets/favicons',
    }),
  ],
};

export default config;
