const Command = require('../structures/Command.js');
const klaw = require('klaw');
const path = require('path');

class ReloadCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'reload',
      description: 'Reload all commands.',
      aliases: ['r'],
      category: 'Owners',
      ownerOnly: true,
      usage: 'reload (-c)',
      flags: [
        {
          flag: '-c',
          description: 'Reload all commands.'
        }
      ]
    });
  }

  async run(message, args) {
    if(args[0] === 'c' || args[0] === 'commands' || args[0] === '-c') {
    try {
      klaw('./commands').on('data', (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== '.js') return;
        const response = this.bot.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) console.error(response);
      });
    }
      catch(e) {
      message.channel.send('Couldn\'t reload commands.');
      console.log(e);
    }
      message.channel.send('Reloaded all commands!');
    }
  }
}

module.exports = ReloadCommand;
