const Command = require('../structures/Command.js');
const { MessageEmbed } = require('discord.js');

class SuggestCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'suggest',
      description: 'Make a new suggestion!',
      usage: 'suggest [Suggestion]',
      aliases: ['suggestion'],
      category: 'Miscellaneous',
      cooldown: 30
    });
  }

  async run(message, args, nbx, util) {
    if (!args[0]) return message.channel.send('You must put a suggestion.');

    const guild = await this.bot.getGuild(message.guild);
    const channel = util.resolveChannel(
      guild.suggestionChannel,
      message.guild.channels.cache
    );
    if (!channel) return message.channel.send('The server owner has not set the suggestions channel, please inform the server\'s administrators.');

    const suggestion = args.join(' ');

    const embed = new MessageEmbed()
      .setTitle('Suggestion')
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(suggestion)
      .setColor('RANDOM')
      .setFooter(
        `Suggestion #${this.bot.generateKey(7)}`,
        this.bot.user.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

      const msg = await channel.send(embed);
      await message.delete();
      await message.channel.send('Your suggestion has been sent.');
      await msg.react('👍');
      await msg.react('👎');
  }
}

module.exports = SuggestCommand;
