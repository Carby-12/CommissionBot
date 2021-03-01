/* eslint-disable no-case-declarations */
const { MessageEmbed } = require('discord.js');
const Command = require('../structures/Command.js');

class ConfigCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'config',
      description: 'Configure or view the settings for the server.',
      aliases: ['setconf', 'setconfig', 'conf'],
      category: 'Setup',
      usage: 'config [prefix | group | verifiedrole | suggestionchannel | view] [(Value)]',
      ownerOnly: false,
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async run(message, args, nbx, util) {

    if(!args[0]) return message.channel.send('Please specify a key to setup.');
		if(args[0] && args[0].toLowerCase() !== 'view' && !args[1]) return message.channel.send('Please specify a value for the key.');

		switch(args[0].toLowerCase()) {
			case 'prefix':
				if(args[1].length >= 4) return message.channel.send('The prefix can only be `1-4` characters long.');
				await this.bot.updateGuild(message.guild, { prefix: args[1] });
				message.channel.send(`Successfully updated the prefix to \`${args[1]}\``);
				break;
			case 'group':
				// eslint-disable-next-line no-case-declarations
				const group = await nbx.getGroup(args[1]).catch(() => {
					message.channel.send('There\'s no ROBLOX group with that ID.');
				});
				if(!group) return message.channel.send('There\'s no ROBLOX group with that ID.');

				await this.bot.updateGuild(message.guild, { robloxGroup: group.id });
				message.channel.send(`Successfully updated the group to \`${group.name}\``);
				break;

			case 'verifiedrole':
				const role = util.resolveRole(args.slice(1).join(' '), message.guild.roles.cache);
				if(!role) return message.channel.send('That role doesn\'t exist.');

				await this.bot.updateGuild(message.guild, { verifiedRole: role.id });
				message.channel.send(`Successfully updated the verified role to ${role.name}`);
				break;

			case 'suggestionchannel':
				const suggestionChannel = util.resolveChannel(args.slice(1).join('-'), message.guild.channels.cache);
				if(!suggestionChannel) return message.channel.send('That channel doesn\'t exist.');

				await this.bot.updateGuild(message.guild, { suggestionChannel: suggestionChannel.id });
				message.channel.send(`Successfully updated the suggestions channel to ${suggestionChannel}`);
				break;
			case 'view':
			// eslint-disable-next-line no-case-declarations
			const guild = await this.bot.getGuild(message.guild);
			// eslint-disable-next-line no-empty-function
			const groupInfo = await nbx.getGroup(guild.robloxGroup).catch(() => {});
			const channel = util.resolveChannel(guild.suggestionChannel, message.guild.channels.cache);
			const embed = new MessageEmbed()
			.setTitle(`Configuration for ${message.guild.name}`)
			.setColor('BLUE')
			.setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.addField('Prefix', guild.prefix)
			.addField('Roblox Group', groupInfo ? groupInfo.name : 'None.')
			.addField('Verified Role', guild.verifiedRole)
			.addField('Suggestions Channel', channel ? channel.name : 'None.')
			.setTimestamp();

			message.channel.send(embed);
			break;
		}
  }
}

module.exports = ConfigCommand;