module.exports = class {
    constructor(bot) {
        this.bot = bot;
    }

    async run(guild) {
        await this.bot.db.delete(guild.id);
        console.log(`Guild removed! ${guild.name} (${guild.id})`);
    }
};