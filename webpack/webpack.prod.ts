import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import paths from './paths';
import common from './webpack.common';

const config: webpack.Configuration = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: paths.postcss.prod,
              },
            },
          },
          'sass-loader',
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: paths.postcss.prod,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre',
        options: {
          webp: {
            method: 6,
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        include: paths.src.blocks,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images',
          limit: 10240,
        },
      },
      {
        test: /\.svg$/,
        include: paths.src.blocks,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'icons',
          limit: 10240,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
});

export default config;
