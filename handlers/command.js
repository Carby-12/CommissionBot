const klaw = require('klaw');
const path = require('path');

module.exports = async bot => {

  klaw('./commands').on('data', (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== '.js') return;
    const response = bot.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) console.error(response);
  });
};
