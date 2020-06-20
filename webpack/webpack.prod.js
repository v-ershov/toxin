const merge = require('webpack-merge');
const pugBem = require('pug-bem');
const miniSvgDataUri = require('mini-svg-data-uri');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths.js');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  output: {
    filename: 'js/[name].[contenthash].js',
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          plugins: pugBem,
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
      {
        test: /\.css$/,
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
        ],
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
          generator: (content) => miniSvgDataUri(content.toString()),
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
});
