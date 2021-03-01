const { inspect } = require('util');
const Command = require('../structures/Command.js');
const PasteGG = require('paste.gg');
const pasteGG = new PasteGG();

class EvalCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category: 'Owners',
      usage: 'eval <expression>',
      aliases: ['ev'],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    try {
			let toEval;
			let evaluated;
      const hrStart = process.hrtime();
      let mode = 0;

			if(args[0] === '-a') {
				toEval = args.join(' ');
        if(toEval.includes('--')) mode = toEval.split('--')[1];
        toEval = toEval.split('--')[0].slice(3);
        evaluated = await eval(`(async () => {\n${toEval}\n})();`);
			}
			else {
				toEval = args.join(' ');
        if(toEval.includes('--')) mode = toEval.split('--')[1];
        toEval = toEval.split('--')[0];
				evaluated = inspect(eval(toEval), { depth: mode });
			}

      const hrDiff = process.hrtime(hrStart);

			if (!toEval) return message.channel.send('Error while evaluating: `air`');

        if(evaluated !== undefined && evaluated !== null && evaluated.length >= 1024) {

          const res = await pasteGG.post({
            name: 'Eval Output',
            files: [{
              name: 'Eval Output',
              content: {
                format: 'text',
                highlight_language: 'javascript',
                value: evaluated.toString()
              }
              }]
          });

          console.log(res);
          message.channel.send(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.\n${res.result.url}`);
        }
      else if(evaluated !== undefined && evaluated !== null && evaluated.length < 1024) {
          message.channel.send(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.\`\`\`js\n${evaluated}\`\`\``);
        }
    }
    catch(e) {
      console.log(e);
			await message.channel.send(`Error while evaluating: \`${e.message}\``);
    }
  }
}

module.exports = EvalCommand;
