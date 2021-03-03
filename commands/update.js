const Command = require('../structures/Command.js');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

class UpdateCommand extends Command {
    constructor(bot) {
      super(bot, {
        name: 'update',
        description: 'Force verify a mentioned user.',
        aliases: ['upd'],
        category: 'Roblox',
        usage: 'update (User)',
        ownerOnly: false,
        userRoles: ['Admin'],
        botPermissions: ['MANAGE_MESSAGES', 'MANAGE_NICKNAMES'],
        cooldown: 15
      });
    }

    async run(message, args, nbx, util) {

        const member = util.resolveMember(args.join(' '), message.guild.members.cache) || message.member;
        let res = await fetch(`https://api.blox.link/v1/user/${member.user.id}`);
        res = await res.json();
        if (res.status === 'error') {return message.channel.send(`${member.user.tag} is not not verified. They can verify by visiting https://blox.link/verify then run the command again.`);}
        const guild = await this.bot.getGuild(message.guild);
        const user = await nbx.getUsernameFromId(res.primaryAccount);
        const rankName = await nbx.getRankNameInGroup(guild.robloxGroup, res.primaryAccount);
        const ranks = await nbx.getRoles(guild.robloxGroup);
        const guildRoles = message.guild.roles.cache.filter(c => ranks.some(f => f.name.includes(c.name))).sort((a, b) => a.rawPosition - b.rawPosition);
        const rolesToRemove = member.roles.cache.filter(c => guildRoles.some(f => f.name.includes(c.name)) && c.name !== rankName);
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
            if (member.nickname !== user) {await member.setNickname(user);}
            if (rolesToRemove && rolesToRemove.size >= 1) {await member.roles.remove(rolesToRemove);}
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                if (!member.roles.cache.has(role.id)) {
                    await member.roles.add(role);
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
                .setColor('BLUE')
                .setFooter(member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription('I couldn\'t change your nickname due to my permissions.');
            return message.channel.send(`Welcome to Sugar Bowl, **${user}**!`, embed);
        }
        const embed = new MessageEmbed()
            .setTitle('Verification')
            .addField('Nickname', user, true)
            .addField('Added Roles', givenRoles.length >= 1 ? givenRoles.map(c => c.name).join(', ') : 'None', true)
            .addField('Removed Roles', rolesToRemove.size >= 1 ? rolesToRemove.map(c => c.name).join(', ') : 'None')
            .setColor('BLUE')
            .setFooter(member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        message.channel.send(`Welcome to ${message.guild.name}, **${user}**!`, embed);
    }
}

module.exports = UpdateCommand;