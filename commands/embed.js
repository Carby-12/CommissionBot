const { MessageEmbed } = require('discord.js');
const Command = require('../structures/Command.js');
const yargs = require('yargs');

class EmbedCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'embed',
      description: 'Create an embed.',
      category: 'Owners',
      usage: 'embed [Title] | [Color] | [Description]',
      aliases: ['em'],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const parsed = yargs(args).option('title', {
      alias: 't',
      type: 'array'
    }).option('description', {
      alias: 'd',
      type: 'array'
    }).option('color', {
      alias: 'c',
      type: 'array'
    }).option('footer', {
      alias: 'f',
      type: 'array'
    }).option('image', {
      alias: 'i',
      type: 'string'
    }).option('thumbnail', {
      alias: 'th',
      type: 'string'
    }).parse();

    if(parsed._.length >= 1) return message.channel.send(`You must provide at least one option. \`${this.config.usage}\``);

    const embed = new MessageEmbed()
    .setTimestamp();

    if(parsed.t || parsed.title) {
      embed.setTitle(parsed.title.join(' '));
    }

    if(parsed.d || parsed.description) {
      embed.setDescription(parsed.description.join(' '));
    }

    if(parsed.c || parsed.color) {
      embed.setColor(parsed.color[0]);
    }

    if(parsed.f || parsed.footer) {
      embed.setFooter(parsed.footer.join(' '), message.guild.iconURL({ dynamic: true }));
    }

    if(parsed.i || parsed.image) {
      embed.setImage(parsed.image[0]);
    }

    if(parsed.th || parsed.thumbnail) {
      embed.setThumbnail(parsed.thumbnail);
    }

    message.channel.send(embed);
  }
}

module.exports = EmbedCommand;
