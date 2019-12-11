const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const { CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  input: path.resolve('./src'),
  output: path.resolve('./dist'),
  blocks: path.resolve('./src/blocks'),
  pugPages: path.resolve('./src/pug/pages'),
  pugBlocksFile: path.resolve('./src/pug/_blocks.pug'),
  postcssConfigFile: path.resolve('./postcss.config.js')
};

const PAGES = fs.readdirSync(PATHS.pugPages).filter(filename => filename.endsWith('.pug'));

(function(){
  let pathsToBlocks = '';
  fs.readdirSync(PATHS.blocks).forEach(function(block) {
    pathsToBlocks += `include ../blocks/${block}/${block}.pug\n`;
  });
  fs.writeFileSync(PATHS.pugBlocksFile, pathsToBlocks);
})();

module.exports = {
  entry: {
    app: `${PATHS.input}/js/index.js`
  },
  output: {
    filename: './js/[name].js',
    path: PATHS.output,
    publicPath: '/'
  },
  externals: {
    paths: PATHS
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: PATHS.postcssConfigFile
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          'import-glob-loader'
        ]
      },
      {
        test: /\.(woff2|woff|ttf|svg|eot|otf)$/,
        exclude: [/icons/, /images/],
        loader: 'file-loader',
        options: {
          name: './fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        exclude: /fonts/,
        loader: 'file-loader',
        options: {
          name: './icons/[name].[ext]'
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: './images/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      filename: `./${page.replace(/\.pug/, '.html')}`,
      template: `${PATHS.pugPages}/${page}`
    }))
  ]
};
