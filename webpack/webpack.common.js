const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const pugBem = require('pug-bem');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  input: path.resolve('src'),
  output: path.resolve('dist'),
  blocks: path.resolve('src/blocks'),
  fonts: path.resolve('src/fonts'),
  pugPages: path.resolve('src/pug/pages'),
  pugBlocks: path.resolve('src/pug/_blocks.pug'),
  postcss: path.resolve('postcss.config.js'),
};

(function writePugBlocks() {
  let pathsToBlocks = '';

  fs.readdirSync(PATHS.blocks).forEach((block) => {
    pathsToBlocks += `include /blocks/${block}/${block}.pug\n`;
  });

  fs.writeFileSync(PATHS.pugBlocks, pathsToBlocks);
}());

module.exports = {
  entry: {
    app: `${PATHS.input}/js/index.js`,
  },
  output: {
    filename: 'js/[name].js',
    path: PATHS.output,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              plugins: [pugBem],
              root: PATHS.input,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
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
                path: PATHS.postcss,
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
          'import-glob-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(woff(2)?|ttf|svg|eot|otf)$/,
        include: PATHS.fonts,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        include: PATHS.blocks,
        loader: 'file-loader',
        options: {
          name: 'icons/[name].[ext]',
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        include: PATHS.blocks,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    ...fs.readdirSync(PATHS.pugPages).map((page) => new HtmlWebpackPlugin({
      filename: `${page.replace(/\.pug/, '.html')}`,
      template: `${PATHS.pugPages}/${page}`,
    })),
  ],
  externals: {
    paths: PATHS,
  },
  resolve: {
    alias: {
      '~': PATHS.input,
    },
  },
};
