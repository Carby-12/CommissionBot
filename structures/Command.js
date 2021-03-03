class Command {

  constructor(bot, {
    name = null,
    description = 'No description provided.',
    category = 'Miscellaneous',
    usage = 'No usage provided.',
    enabled = true,
    cooldown = 3,
    accessableby = 'Members',
    userPermissions = new Array(),
    botPermissions = new Array(),
    ownerOnly = false,
    aliases = new Array(),
    flags = [{ flag: '', description: 'None.' }],
		userRoles = new Array()
  }) {
    this.bot = bot;
    this.config = { enabled, aliases, name, description, category, usage, cooldown, botPermissions, userPermissions, ownerOnly, accessableby, flags, userRoles };
  }
}
module.exports = Command;
