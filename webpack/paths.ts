import path from 'path';

const context = {
  src: path.resolve('src'),
  dist: path.resolve('dist'),
  postcss: path.resolve('postcss'),
};

const src = {
  blocks: `${context.src}\\blocks`,
  content: `${context.src}\\content`,
  fonts: `${context.src}\\fonts`,
  pug: `${context.src}\\pug`,
  pages: `${context.src}\\pug\\pages`,
  scss: `${context.src}\\scss`,
  ts: `${context.src}\\ts`,
};

const postcss = {
  dev: `${context.postcss}\\postcss.dev.js`,
  prod: `${context.postcss}\\postcss.prod.js`,
};

const paths = {
  context,
  src,
  postcss,
};

export default paths;
