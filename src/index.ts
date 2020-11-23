import '~/scss/_fonts.scss';
import '~/scss/_global.scss';

// https://webpack.js.org/guides/dependency-management/
function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys().forEach(r);
}

importAll(require.context('~/blocks/', true, /\.ts$/));
importAll(require.context('~/blocks/', true, /\.scss$/));
