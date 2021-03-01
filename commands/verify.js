const Command = require('../structures/Command.js');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

class VerifyCommand extends Command {
    constructor(bot) {
      super(bot, {
        name: 'verify',
        description: 'Link your roblox account with your Discord account.',
        aliases: ['ver'],
        category: 'Roblox',
        usage: 'verify',
        ownerOnly: false,
        botPermissions: ['MANAGE_MESSAGES', 'MANAGE_NICKNAMES'],
        cooldown: 15
      });
    }

    async run(message, args, nbx, util) {
        let res = await fetch(`https://api.blox.link/v1/user/${message.author.id}`);
        res = await res.json();
        if (res.status === 'error') {return message.channel.send('You\'re not verified. You can verify by visiting https://blox.link/verify then run the command again.');}
        const guild = await this.bot.getGuild(message.guild);
        const user = await nbx.getUsernameFromId(res.primaryAccount);
        const rankName = await nbx.getRankNameInGroup(guild.robloxGroup, res.primaryAccount);
        const ranks = await nbx.getRoles(guild.robloxGroup);
        const guildRoles = message.guild.roles.cache.filter(c => ranks.some(f => f.name.includes(c.name))).sort((a, b) => a.rawPosition - b.rawPosition);
        const rolesToRemove = message.member.roles.cache.filter(c => guildRoles.some(f => f.name.includes(c.name)) && c.name !== rankName);
        const roles = [util.resolveRole(rankName, message.guild.roles.cache)];
        const verifiedRole = util.resolveRole(guild.verifiedRole, message.guild.roles.cache) || util.resolveRole('Verified', message.guild.roles.cache);
        if(!verifiedRole) {
            await message.guild.roles.create({
                data: {
                    name: 'Verified'
                }
            });
        }
        roles.push(verifiedRole);
        if(!roles[0]) {
            roles[0] = await message.guild.roles.create({
                data: {
                    name: rankName,
                }
            });
        }
        const givenRoles = [];
        try {
            if (message.member.nickname !== user) await message.member.setNickname(user);
            if (rolesToRemove && rolesToRemove.size >= 1) {await message.member.roles.remove(rolesToRemove);}
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (!message.member.roles.cache.has(role.id)) {
                    await message.member.roles.add(role);
                    givenRoles.push(role);
                }
            }
        }
        catch (error) {
            const embed = new MessageEmbed()
                .setTitle('Verification')
                .addField('Nickname', user, true)
                .addField('Should be added roles', givenRoles.length >= 1 ? givenRoles.map(c => c.name).join(', ') : 'None', true)
                .addField('Should be removed roles', rolesToRemove.size >= 1 ? rolesToRemove.map(c => c.name).join(', ') : 'None')
                .setColor(0xFF69B4)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription('I couldn\'t change your nickname due to my permissions.');
            return message.channel.send(`Welcome to Sugar Bowl, **${user}**!`, embed);
        }
        const embed = new MessageEmbed()
            .setTitle('Verification')
            .addField('Nickname', user, true)
            .addField('Added Roles', givenRoles.length >= 1 ? givenRoles.map(c => c.name).join(', ') : 'None', true)
            .addField('Removed Roles', rolesToRemove.size >= 1 ? rolesToRemove.map(c => c.name).join(', ') : 'None')
            .setColor(0xFF69B4)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        message.channel.send(`Welcome to ${message.guild.name}, **${user}**!`, embed);

    }
}

module.exports = VerifyCommand;