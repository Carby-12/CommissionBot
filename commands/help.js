const Command = require('../structures/Command.js');
const { MessageEmbed } = require('discord.js');

class Help extends Command {
  constructor(bot) {
    super(bot, {
      name: 'help',
      description: 'Displays all the available commands for you.',
      category: 'Miscellaneous',
      usage: 'help [command]',
      aliases: ['h', 'halp']
    });
  }

  async run(message, args) {

    if (!args[0]) {

      const myCommands = this.bot.commands;

      let currentCategory = '';
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(this.bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix for this server is: \`!!\` or \`${this.bot.user.tag}\``)
        .setFooter(`${message.member.displayName} | Total Commands: ${this.bot.commands.size}`, message.author.displayAvatarURL({ dynamic: true }));
      const sorted = myCommands.array().sort((p, c) => p.config.category > c.config.category ? 1 : p.config.name > c.config.name && p.config.category === c.config.category ? 1 : -1);
      sorted.forEach(c => {
        const cat = c.config.category.toProperCase();
        if (currentCategory !== cat) {
          currentCategory = cat;
          if (message.author.id === process.env.OWNER) embed.addField(`${currentCategory}`, myCommands.filter(a => a.config.category == currentCategory).map(b => `\`${b.config.name}\``).join(', '));
          else if (currentCategory !== 'Owners') embed.addField(`${currentCategory}`, myCommands.filter(a => a.config.category == currentCategory).map(b => `\`${b.config.name}\``).join(', '));
        }
      });

      message.channel.send(embed);

    }
    else {
      // Show individual command's help.
      let command = args[0];
      if (this.bot.commands.has(command)) {
        command = this.bot.commands.get(command);
        message.channel.send(`= ${command.config.name} = \n${command.config.description}\nUsage:: ${command.config.usage}\nAliases:: ${command.config.aliases.join(', ')}`, { code: 'asciidoc' });
      }
    }
  }
}

module.exports = Help;
