const { merge } = require('webpack-merge');
const miniSvgDataUri = require('mini-svg-data-uri');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./webpack.paths.js');
const common = require('./webpack.config.base.js');

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
        test: /\.(sass|scss)$/,
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
