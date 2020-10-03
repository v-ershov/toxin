import '~/scss/_fonts.scss';
import '~/scss/_global.scss';

// https://webpack.js.org/guides/dependency-management/
function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('~/blocks/', true, /\.js|scss$/));
