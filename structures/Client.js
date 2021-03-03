const { Client, Collection } = require('discord.js');
const util = require('util');
const path = require('path');
const Keyv = require('keyv');
const KeyFile = require('keyv-file').KeyvFile;
const Trello = require('trello');

module.exports = class BotClient extends Client {
	constructor(options) {
		super(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.config = require('../config.json');
		this.wait = util.promisify(setTimeout);
		this.defaultSettings = {
			prefix: '!',
			robloxGroup: '0',
			vcBans: [],
      suggestionChannel: 'suggestions',
			verifiedRole: 'Verified'
		};
    this.db = new Keyv({ store: new KeyFile({ filename: './db/settings-121qrjvfk1t.json' }) });
    this.trello = new Trello(this.config.trelloAppKey, this.config.trelloToken);

    this.db.on('error', (err) => {
      console.error(err);
    });
  }

	loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.config.name, props);
      if(props.config.aliases) {
props.config.aliases.forEach(alias => {
        this.aliases.set(alias, props.config.name);
      });
}
      return false;
    }
 catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async reloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    }
 else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    this.commands.delete(command);
    const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
    this.commands.set(props.config.name, props);
    if(props.config.aliases) props.config.aliases.forEach(a => this.aliases.set(a, props.config.name));
    return false;
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    }
 else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }


	generateKey(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	async getGuild(guild) {
		if(!guild) return false;
		const res = await this.db.get(guild.id);

		if(res) return res;
	}

	async updateGuild(guild, settings) {
    let data = await this.getGuild(guild);

		if (typeof data !== 'object') data = {};
		Object.keys(settings).forEach(key => {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		});

		console.log(`Guild "${guild.name}" updated settings: ${Object.keys(settings)}`);
		return await this.db.set(guild.id, data);
	}

	async makeGuild(guild, settings) {
		const merged = Object.assign(this.defaultSettings, settings);

		const newGuild = await this.db.set(guild.id, merged);
		return newGuild;
	}
};
