import path from 'path';

const src = path.resolve('src');
const dist = path.resolve('dist');
const postcss = path.resolve('postcss');

const paths = {
  src: {
    _: src,
    assets: {
      content: `${src}\\assets\\content`,
      fonts: `${src}\\assets\\fonts`,
    },
    blocks: `${src}\\blocks`,
    pug: {
      pages: `${src}\\pug\\pages`,
    },
    scss: {
      _functions: `${src}\\scss\\_functions.scss`,
      _mixins: `${src}\\scss\\_mixins.scss`,
      _vars: `${src}\\scss\\_vars.scss`,
    },
    index: `${src}\\index.ts`,
  },
  dist,
  postcss: {
    dev: `${postcss}\\postcss.dev.js`,
    prod: `${postcss}\\postcss.prod.js`,
  },
};

export default paths;
