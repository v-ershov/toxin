import '~/scss/index.scss';

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('~/blocks/', true, /\.js$/));
