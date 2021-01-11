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
            // const command = this.handler.findCommand(cmd)
            // console.log(`filepath: ${command.filepath}`);
            this.handler.load(cmd);
            
            embed.setDescription(`Command **${cmd}** has been loaded!`)
            embed.setColor('GREEN')

        } catch(err) {
            console.log(err);
            embed.setDescription(`Error loading command: ${err}`);
            embed.setColor('RED');
        }

        return message.util.send(embed);
    }
}