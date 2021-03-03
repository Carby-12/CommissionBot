const { MessageEmbed } = require('discord.js');
const Command = require('../structures/Command.js');
const moment = require('moment');

class WhoIsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'whois',
            category: 'Roblox',
            aliases: ['profilesearch'],
            description: 'Displays information about a certain user.',
						userRoles: ['Admin']
        });
    }

    async run(message, args, nbx) {

        if(!args[0]) return message.channel.send('You must provide a user to search for.');
        try {
            const userid = await nbx.getIdFromUsername(args[0]);
            const user = await nbx.getPlayerInfo({ userId: userid });
            const guild = await this.bot.getGuild(message.guild);
            const rank = await nbx.getRankNameInGroup(guild.robloxGroup, userid);
            const isBanned = guild.vcBans.find(c => c.userId === userid);

            const embed = new MessageEmbed()
            .setTitle('User Information')
            .setDescription(user.isBanned ? 'User is banned from ROBLOX.' : '')
            .addField('Username', user.username, true)
            .addField('User ID', userid, true)
            .addField('Group Rank', rank)
            .addField('Account age', `${user.age} days old`)
            .addField('Join date', moment.utc(user.joinDate).format('L'))
            .addField('VC Banned', isBanned ? 'User is VC Banned.' : 'User is not VC Banned.')
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userid}&width=720&height=720&format=png`)
            .setTimestamp();

            message.channel.send(embed);
        }
        catch(e) {
            console.error(e);
            message.channel.send(`I couldn't find a user called \`${args[0]}\`, make sure to double-check your spelling and try again!`);
        }
    }
}

module.exports = WhoIsCommand;