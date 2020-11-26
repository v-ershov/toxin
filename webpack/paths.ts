import path from 'path';

const src = path.resolve('src');
const dist = path.resolve('dist');
const postcss = path.resolve('postcss');

const assets = `${src}\\assets`;
const pug = `${src}\\pug`;

const paths = {
  src: {
    _: src,
    assets: {
      content: `${assets}\\content`,
      favicons: `${assets}\\favicons`,
      fonts: `${assets}\\fonts`,
    },
    blocks: `${src}\\blocks`,
    pug: {
      _: pug,
      pages: `${pug}\\pages`,
    },
    scss: `${src}\\scss`,
    ts: `${src}\\ts`,
  },
  dist,
  postcss: {
    dev: `${postcss}\\postcss.dev.js`,
    prod: `${postcss}\\postcss.prod.js`,
  },
};

export default paths;
