module.exports = class {
    constructor(bot) {
        this.bot = bot;
    }

    async run(guild) {
        await this.bot.makeGuild(guild, {});
        console.log(`New guild added! ${guild.name} (${guild.id})`);
    }
};