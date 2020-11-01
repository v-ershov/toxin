// https://webpack.js.org/configuration/configuration-languages/#typescript

import webpack from 'webpack';
import fs from 'fs';

// @ts-ignore
import pugBem from 'pug-bem';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import paths from './paths';

const config: webpack.Configuration = {
  entry: {
    app: [
      '@babel/polyfill',
      `${paths.src.ts}/index.ts`,
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
    extensions: ['.ts', '.js', '.sass', 'scss'],
  },
  stats: {
    children: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          plugins: [pugBem],
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
          outputPath: (url: string, resourcePath: string): string => {
            const path: string[] = resourcePath.split('\\');
            return `plugin-files/${path[path.indexOf('node_modules') + 1]}/${url}`;
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
    ...fs.readdirSync(paths.src.pages).map((page) => new HtmlWebpackPlugin({
      filename: `${page.replace(/\.pug/, '.html')}`,
      template: `${paths.src.pages}/${page}`,
    })),
  ],
};

export default config;
