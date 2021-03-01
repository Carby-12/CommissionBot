const readdir = require('util').promisify(require('fs').readdir);

module.exports = async bot => {

  const evtFiles = await readdir('./events/');
    evtFiles.forEach(file => {
      const eventName = file.split('.')[0];
      const event = new (require(`../events/${file}`))(bot);
      // This line is awesome by the way. Just sayin'.
      bot.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`../events/${file}`)];
    });
};
