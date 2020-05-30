const fs = require('fs');
const paths = require('./paths.js');

// creates _blocks.pug file with imports of all blocks
const createBlocksFile = () => {
  let pathsToBlocks = '';

  fs.readdirSync(paths.src.blocks).forEach((block) => {
    pathsToBlocks += `include /blocks/${block}/${block}.pug\n`;
  });

  fs.writeFileSync(`${paths.src.pug}/_blocks.pug`, pathsToBlocks);
};

module.exports = {
  createBlocksFile,
};
