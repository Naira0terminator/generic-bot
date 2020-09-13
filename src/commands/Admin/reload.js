const { Command } = require('discord-akairo');

module.exports = class reloadCmd extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload'],
            ownerOnly: true,
            args: [
                {
                    id: 'cmd',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'event',
                    match: 'flag',
                    flag: '-e',
                },
                {
                    id: 'load',
                    match: 'flag',
                    flag: '-l',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all',
                }
            ],
        });
    }
    exec(message, { cmd, event, all }) {

        try {

            let response = `**${cmd}** has been reloaded!`;

            if(event) this.client.listenerHandler.reload(cmd);

            else if(all) {
                this.handler.reloadAll();
                response = "All commands have been reloaded!";
            }
 
            else this.handler.reload(cmd);

            const embed = this.client.util.embed()
            .setDescription(response)
            .setColor('GREEN')
            return message.util.send(embed);
            
        } 
        catch(err) {
        console.log(err);
        message.reply(`i could not find **${cmd}**`);
    }
  }
}
