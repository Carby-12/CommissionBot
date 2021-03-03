const { MessageEmbed } = require('discord.js');
const Command = require('../structures/Command.js');

class RemoveTBanCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'removetban',
            description: 'Remove a trello ban for a user.',
            cooldown: 10,
            category: 'Moderation',
            userRoles: ['Head Admin'],
            aliases: ['untban', 'untrelloban'],
            usage: 'untban [Roblox Username]'
        });
    }
    async run(message, args, nbx, util) { // eslint-disable-line no-unused-vars

        try {

        if(!args[0]) return message.channel.send('You must provide a username to remove the ban for.');
        const userid = await nbx.getIdFromUsername(args[0]);
        const userInfo = await nbx.getPlayerInfo({ userId: userid });

        this.bot.trello.getCardsOnList(process.env.BANS_LIST_ID || this.bot.config.bansListId, (err, cards) => {
            if(err) console.error(err);

            const ban = cards.find(c => c.name.includes(userid));

            if(!ban) return message.channel.send('That user is not banned.');

            this.bot.trello.updateCard(ban.id, 'closed', true, (err) => {
                if(err) console.error(err);
            });

            const embed = new MessageEmbed()
            .setTitle('Success')
            .setDescription(`Successfully removed trello ban for [${userInfo.username}](${ban.shortUrl})`)
            .setTimestamp()
            .setColor(0x00ff00)
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userid}&width=720&height=720&format=png`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }));

            message.channel.send(embed);
        });
    }
    catch(e) {
        message.channel.send(`I couldn't find a user called \`${args[0]}\`, make sure to double-check your spelling and try again!`);
    }
    }
}

module.exports = RemoveTBanCommand;