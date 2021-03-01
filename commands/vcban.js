const Command = require('../structures/Command.js');

class VcBanCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'vcban',
			description: 'Ban someone from getting the Valued Customer rank.',
			aliases: ['cban'],
			category: 'Moderation',
			usage: '!!vcban [Roblox Username] (Reason)',
			ownerOnly: false,
			userPermissions: ['BAN_MEMBERS'],
			accessableby: 'Administrators'
		});
	}

	async run(message, args, nbx) {

		if (!args[0]) return message.channel.send('You must provide a Roblox Username to ban.');
		const guild = await this.bot.getGuild(message.guild);

		const user = await nbx.getIdFromUsername(args[0]).catch(() => { message.channel.send('That user seems not to exist, make sure to double check your spelling and try again.'); });

		if (guild.vcBans.find(c => c.userId === user)) return message.channel.send('That user is already banned.');

		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason given.';

		await guild.vcBans.push({ userId: user, reason });
		await this.bot.updateGuild(message.guild, { vcBans: guild.vcBans });

		message.channel.send(`Successfully vcbanned ${(await nbx.getUsernameFromId(user))}`);
	}
}

module.exports = VcBanCommand;