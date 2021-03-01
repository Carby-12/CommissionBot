const Command = require('../structures/Command.js');

class TestCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'test',
      description: 'Test.',
      aliases: ['t'],
      category: 'Owners',
      usage: '!!test',
      ownerOnly: true,
    });
  }

  async run(message, args, nbx, util) { // eslint-disable-line no-unused-vars

    message.channel.send('This is a test command.');
  }
}

module.exports = TestCommand;