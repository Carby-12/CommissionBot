const Command = require('../structures/Command.js');

class Ping extends Command {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      description: 'Latency and API response times.',
      category: 'Fun',
      usage: 'ping',
      aliases: ['pong']
    });
  }

  async run(message, args) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send('🏓 Ping!');
      msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.bot.ws.ping)}ms.)`);
    }
 catch (e) {
      console.log(e);

    }
  }
}

module.exports = Ping;
