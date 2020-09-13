const { Command, Argument } = require('discord-akairo');

module.exports = class H_or_T extends Command {
    constructor() {
        super('ht', {
            aliases: ['flip', 'ht'],
            cooldown: 8000,
            lock: 'channel',
            description: {
                content: 'A coin flip game choose either heads(h) or tails(t)',
                examples: ['heads', 'tails']
            },
            channel: 'guild',
            args: [
                {
                    id: 'input',
                    match: 'rest',
                    type: Argument.compose('lowercase')
                },
            ],
        });
    }
    exec(message, { input }) {
        
        if(!input) return message.reply('you must input either heads(h) or tails(t)');

        let h_t = Math.floor(Math.random() * 100);
        let result;

        if(input == "h") input = "heads";
        if(input == "t") input = "tails";

        if (h_t > 50) result = "heads";
        if(h_t < 50) result = "tails";

        if(input == "heads" && result == "heads") return message.reply("You win its heads!");

        else if(input == "tails" && result == "tails") return message.reply("You win its tails");

        else return message.reply(`You lose its ${result}`);

    }
}


