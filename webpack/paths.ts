import path from 'path';

const src = path.resolve('src');
const dist = path.resolve('dist');
const postcss = path.resolve('postcss');

const paths = {
  src: {
    _: src,
    assets: {
      content: `${src}\\assets\\content`,
      favicons: {
        _fav: `${src}\\assets\\favicons\\fav.svg`,
      },
      fonts: `${src}\\assets\\fonts`,
    },
    blocks: `${src}\\blocks`,
    pug: {
      pages: `${src}\\pug\\pages`,
    },
    _index: `${src}\\index.ts`,
  },
  dist,
  postcss: {
    _dev: `${postcss}\\postcss.dev.js`,
    _prod: `${postcss}\\postcss.prod.js`,
  },
};

export default paths;
