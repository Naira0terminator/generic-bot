const { Command } = require('discord-akairo');

module.exports = class loadCmd extends Command {
    constructor() {
        super('load', {
            aliases: ['load'],
            ownerOnly: true,
            args: [
                {
                    id: 'cmd',
                    type: 'string',
                    match: 'rest',
                },
            ],
        });
    }
    exec(message, { cmd }) {

        const embed = this.client.util.embed()

        try {
            
            this.handler.load(cmd);
            
            embed.setDescription(`Command **${cmd}** has been loaded!`)
            embed.setColor('GREEN')

        } catch(err) {
            console.log(err);
            embed.setDescription('Could not find the provided module!')
            embed.setColor('RED')
        }

        return message.util.send(embed);
    }
}