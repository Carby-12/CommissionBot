const { MessageEmbed } = require('discord.js');
const Command = require('../structures/Command.js');

class TBanCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'tban',
            description: 'Trello ban a user',
            cooldown: 10,
            category: 'Moderation',
            userRoles: ['Head Admin', 'Staff Manager'],
            aliases: ['trelloban'],
            usage: 'tban [Roblox Username]'
        });
    }
    async run(message, args, nbx, util) { // eslint-disable-line no-unused-vars

        try {

            if (!args[0]) return message.channel.send('You must provide a username to ban.');
            const userid = await nbx.getIdFromUsername(args[0]);
            const userInfo = await nbx.getPlayerInfo({ userId: userid });

            this.bot.trello.getCardsOnList(process.env.BANS_LIST_ID || this.bot.config.bansListId, (err, cards) => {
                if (err) console.error(err);
                if (cards.find(c => c.name.includes(userid))) return message.channel.send('That user is already trello banned.');

                this.bot.trello.addCard(`${userInfo.username}:${userid}`, `**Banned by:** ${message.author.tag} (${message.author.id})`, this.bot.config.bansListId, (err, card) => {
                    if (err) console.error(err);

                    const embed = new MessageEmbed()
                        .setTitle('Success')
                        .setColor(0x00ff00)
                        .setDescription(`Successfully trello banned [${userInfo.username}](${card.shortUrl})`)
                        .setTimestamp()
                        .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userid}&width=720&height=720&format=png`)
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }));

                    message.channel.send(embed);
                });
            });

        }
        catch (e) {
            message.channel.send(`I couldn't find a user called \`${args[0]}\`, make sure to double-check your spelling and try again!`);
        }

    }
}

module.exports = TBanCommand;