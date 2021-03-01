const nbx = require('noblox.js');

module.exports = class {
	constructor(bot) {
		this.bot = bot;
	}

	async run() {
		console.log(
			`${this.bot.user.username
			} is ready to watch ${this.bot.guilds.cache.reduce(
				(prev, val) => val.memberCount + prev,
				0
			)} users and ${this.bot.guilds.cache.size} servers!`
		);

		const statuses = [
			`${this.bot.config.prefix}help`,
			`over ${this.bot.guilds.cache.reduce(
				(prev, val) => val.memberCount + prev,
				0
			)} users!`
		];

		setInterval(() => {
			this.bot.user.setActivity(statuses.random(), { type: 'WATCHING' });
		}, 60000);

		await nbx.setCookie('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_295731694B029E356D0D26C4D803920076C4DB552D6010E352A67F3810C58F84F366EAA2C6132A06F34A74A9736D14CBF500E4E53FB35ACE58EBD3B8A8D57A0B57CAAEEF664B337F6FC9BFC7A78D67371BC281A0961B042B510FCF5E156F0A59EFB5892C5F553E145682A2EA3749BEF278C868D622EF180AFF3367A492E2627AF185151FABD858FCE9505145313946AFA94552F4AE939649A98829E15034E638C0A7A950734B7A6D65E698945A93BA0A86D63AF34B0A42E6995130954BBFA58474752AB309E21F28F04331B4FBBD9BD3A64267E19ABF3D5603592C0E0473EF88603081383BC4B3246F328FF2AADF15608721AAFA0EDEF65C0C46B8C0346A1AB55A08E8164C52AEDFBD731AB664FBC2CFA8C0F7EC9FF8BBBD2803D66E4F048CC36667FF5955226982CF4DCB5E4A26F51321645B7B');

		this.bot.guilds.cache.keyArray().forEach(async id => {

			const res = await this.bot.db.get(id);
			if(!res) {
				console.log('Setting up guild....');
				console.log(res);
				await this.bot.db.set(id, {
					guildId: id,
					prefix: '!!',
					robloxGroup: 0,
					vcBans: [],
					verifiedRole: 'Verified',
					suggestionChannel: 'suggestions'
				});
			}
		});
	}
};
