const Command = require('../structures/Command.js');
const Discord = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');

class StatsCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'stats',
      description: 'Stats about the this.bot.',
      aliases: ['s'],
      category: 'Miscellaneous',
      usage: '!!stats'
    });
  }

  async run(message, args) { // eslint-disable-line no-unused-vars


    const { version } = require('discord.js');

    function duration(ms) {
      const sec = Math.floor((ms / 1000) % 60).toString();
      const min = Math.floor((ms / (1000 * 60)) % 60).toString();
      const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
      const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
      return `${days.padStart(1, '0')}d, ${hrs.padStart(2, '0')}h, ${min.padStart(2, '0')}m, ${sec.padStart(2, '0')}s. `;
    }

    const usersize = this.bot.guilds.cache.reduce((prev, val) => val.memberCount + prev, 0);
    cpuStat.usagePercent((err, percent) => {
      if (err) console.error(err);
      const botembed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addField('• Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
        .addField('• Uptime ', `${duration(this.bot.uptime)}`, true)
        .addField('• Users', `${usersize}`, true)
        .addField('• Servers', `${this.bot.guilds.cache.size.toLocaleString()}`, true)
        .addField('• Channels ', `${this.bot.channels.cache.size.toLocaleString()}`, true)
        .addField('• Discord.js', `v${version}`, true)
        .addField('• Node', `${process.version}`, true)
        .addField('• Official Server', '[Join me!](https://discord.gg/V7Zpe6N)', true)
        .addField('• CPU', `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
        .addField('• CPU usage', `\`${percent.toFixed(2)}%\``, true)
        .addField('• Arch', `\`${os.arch()}\``, true)
        .addField('• Platform', `\`\`${os.platform()}\`\``, true)
        .setFooter(`• Bot ID: ${this.bot.user.id}`, this.bot.user.displayAvatarURL())
        .setTimestamp();


      message.channel.send(botembed);
    });
  }
}

module.exports = StatsCommand;
