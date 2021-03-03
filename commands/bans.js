const Command = require('../structures/Command.js');
const Discord = require('discord.js');
const { Menu } = require('discord.js-menu');

function chunkArray(myArray, chunk_size) {
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];
    let myChunk;

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index + chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
}

class VcBansCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'bans',
      description: 'Shows a list of banned users.',
      aliases: ['vcbans', 'vcbansshow'],
      category: 'Moderation',
      usage: 'bans',
      ownerOnly: false,
			userRoles: ['Head Admin', 'Staff Manager'],
      accessableby: 'Administrators'
    });
  }

  async run(message, args, nbx) {
		const guild = await this.bot.getGuild(message.guild);

    if(guild.vcBans.length < 1) return message.channel.send('There are no bans in my database.');

		const chunks = chunkArray(guild.vcBans, 20);
		const embeds = new Array();
		for(let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];
			const embed = new Discord.MessageEmbed()
			.setTitle('Current Bans')
			.setColor('RANDOM')
			.setTimestamp()
			.setDescription('These are the current bans in my database.')
			.setFooter(`Page ${i + 1} out of ${chunks.length}`);

			for (const key of chunk) {
				const user = await nbx.getUsernameFromId(key.userId);
				embed.addField(`${user} | ${key.userId}`, key.reason);
			}

			embeds.push({
          name: `embed${i}`,
          content: embed,
          reactions: {
            '◀️': 'previous',
            '▶️': 'next',
            '❌': 'stop'
          }
        });
		}
		const menu = new Menu(message.channel, message.author.id, embeds, 120000);
		menu.start();
	}
}

module.exports = VcBansCommand;