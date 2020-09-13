const { Command } = require('discord-akairo');
const math = require('mathjs')

module.exports = class MathCmd extends Command {
    constructor() {
        super('math', {
            aliases: ['math', 'calculate', 'calc'],
            description: {
                content: 'this command can perform simple or advanced math functions and conversions',
                examples: ['5+10 * (500/20)', '30kgs to lbs', 'sqrt(4)'],
            },
            cooldown: 6000,
            args: [{
                id: 'mathArgs',
                match: 'rest',
            }],
        });
    }
    exec(message, { mathArgs }) {

        if(!mathArgs) return message.util.reply('you must input a calculation!');
        
        let doMath;
        try {
            doMath = math.evaluate(mathArgs);
        } catch (e) {
            return message.util.reply('that is not a valid calculation!');
        }
       
        message.util.send(this.client.util.embed()
        .addField("output: ", doMath)
        .setColor('RANDOM'));
    }
}