const path = require('path');

const CONTEXT = {
  src: path.resolve('src'),
  dist: path.resolve('dist'),
  postcss: path.resolve('postcss'),
};

const SRC = {
  blocks: `${CONTEXT.src}\\blocks`,
  content: `${CONTEXT.src}\\content`,
  fonts: `${CONTEXT.src}\\fonts`,
  pug: `${CONTEXT.src}\\pug`,
  pages: `${CONTEXT.src}\\pug\\pages`,
};

const POSTCSS = {
  dev: `${CONTEXT.postcss}\\dev`,
  prod: `${CONTEXT.postcss}\\prod`,
};

module.exports = {
  context: CONTEXT,
  src: SRC,
  postcss: POSTCSS,
};
