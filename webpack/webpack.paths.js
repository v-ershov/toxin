const path = require('path');

const context = {
  src: path.resolve('src'),
  dist: path.resolve('dist'),
  postcss: path.resolve('postcss'),
};

const src = {
  blocks: `${context.src}\\blocks`,
  content: `${context.src}\\content`,
  fonts: `${context.src}\\fonts`,
  js: `${context.src}\\js`,
  pug: `${context.src}\\pug`,
  pages: `${context.src}\\pug\\pages`,
  scss: `${context.src}\\scss`,
};

const postcss = {
  dev: `${context.postcss}\\dev`,
  prod: `${context.postcss}\\prod`,
};

module.exports = {
  context,
  src,
  postcss,
};