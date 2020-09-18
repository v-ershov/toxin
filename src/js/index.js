import helpers from '~/js/helpers';
import '~/scss/_fonts.scss';
import '~/scss/_global.scss';

helpers.importAll(require.context('~/blocks/', true, /\.js|scss$/));
