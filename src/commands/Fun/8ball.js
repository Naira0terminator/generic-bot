const { Command } = require('discord-akairo');

module.exports = class eightBall extends Command {
    constructor() {
        super('8ball', {
            aliases: ["8ball"],
            cooldown: 8000,
            lock: 'channel',
            description: 'Ask the eight ball a question it never lies',
            args: [
                {
                    id: 'q',
                    type: 'string',
                }
            ]
            
        });
    }
    exec(message, { q }) {

        if(!q) return message.reply('you must ask the 8ball a question!');

        const answers = ['Yes', 'No', 'possibly', 'dont count on it'];
         
        message.util.send(answers[Math.floor(Math.random()*answers.length)]);
    }
}
