const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer,
    cssMqpacker,
    cssnano({
      preset: [
        'default', {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
