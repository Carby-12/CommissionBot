const Command = require('../structures/Command.js');

function removeUserFromBans(bans, userId) {
  for (let i = 0; i < bans.length; i++) {
		if(bans[i].userId === userId) {
			bans.splice(i, 1)
		}
	};

	return bans;
}

class UnVCBanCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'unvcban',
			description: 'Unban someone from getting the Valued Customer rank.',
			aliases: ['uncban', 'removevcban'],
			category: 'Moderation',
			usage: '!!unvcban [Roblox Username]',
			ownerOnly: false,
			userRoles: ['Head Admin', 'Staff Manager'],
			accessableby: 'Administrators'
		});
	}

	async run(message, args, nbx) {

			if (!args[0]) return message.channel.send('You must provide a Roblox Username to ban.');
		const guild = await this.bot.getGuild(message.guild);

		const user = await nbx.getIdFromUsername(args[0]).catch(() => { message.channel.send('That user seems not to exist, make sure to double check your spelling and try again.'); });

		if(!guild.vcBans.find(c => c.userId === user)) return message.channel.send('That user is not banned.');

	const newArray = removeUserFromBans(guild.vcBans, user);

	await this.bot.updateGuild(message.guild, { vcBans: newArray });

	message.channel.send(`Successfully unbanned ${(await nbx.getUsernameFromId(user))}.`);

	}
}

module.exports = UnVCBanCommand;