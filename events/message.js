const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const nbx = require('noblox.js');
const ClientUtil = require('../structures/ClientUtil.js');

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(message) {

  if(message.author.bot || message.channel.type === 'dm') return;

  const prefixMention = new RegExp(`^<@!?${this.bot.user.id}> `);
	const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : this.bot.config.prefix;


	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

  if(!message.content.startsWith(prefix)) return;

  const commandfile = this.bot.commands.get(cmd) || this.bot.commands.get(this.bot.aliases.get(cmd));
  if (commandfile) {

			if (commandfile.config.userPermissions && !message.member.hasPermission(commandfile.config.userPermissions)) return message.channel.send(`The \`${commandfile.config.name}\` command requires you to have the '${commandfile.config.userPermissions[0]}' permission(s).`);

			if (commandfile.config.botPermissions && !message.guild.me.hasPermission(commandfile.config.botPermissions)) return message.channel.send(`The \`${commandfile.config.name}\` command requires me to have the '${commandfile.config.botPermissions[0]}' permission(s).`);

			if (commandfile.config.CanRank && !message.member.roles.cache.has('790005459141656587')) return message.channel.send('You do not have permission to run this command.');
			if (commandfile.config.CanHost && !message.member.roles.cache.has('790005459083329557')) return message.channel.send('You do not have permissiont to run this command.');
			if (commandfile.config.ownerOnly && commandfile.config.ownerOnly === true && message.author.id !== '413834975347998720') return message.channel.send(`The \`${commandfile.config.name}\` command can only be used by the bot owner`);
			if (message.author.id !== '413834975347998720' && commandfile.config.enabled === false) return message.channel.send(`The command\`${commandfile.config.name}\` is disabled.`);

    }

    if (!cooldowns.has(commandfile.config.name)) cooldowns.set(commandfile.config.name, new Discord.Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(commandfile.config.name);
		const cooldownAmount = (commandfile.config.cooldown) * 1000;


		if (!timestamps.has(message.author.id) && message.author.id !== '413834975347998720') {
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
		else {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime && message.author.id !== '413834975347998720') {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${commandfile.config.name}\` command. ${message.author}`);
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		}

		const util = new ClientUtil(this.bot);

    try {
		commandfile.run(message, args, nbx, util);
    }
    catch(e) {
      console.log(e);
      message.channel.send(`An error occured while executing this command! Report this to the bot owner: \`${e}\``);
    }
  }
};
