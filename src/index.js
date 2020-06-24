import './scss/_fonts.scss';
import './scss/_global.scss';

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('./blocks/', true, /\.js$/));
importAll(require.context('./blocks/', true, /\.scss$/));
