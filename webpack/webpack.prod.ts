import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import common from './webpack.common';
import paths from './paths';

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
                config: paths.postcss._prod,
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: paths.postcss._prod,
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
        test: /\.(jpe?g|png|gif|svg)$/,
        include: paths.src.blocks,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/images',
          limit: 10240,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new FaviconsWebpackPlugin({
      logo: paths.src.assets.favicons._fav,
      outputPath: 'assets/favicons/',
      prefix: 'assets/favicons/',
    }),
  ],
});

export default config;
