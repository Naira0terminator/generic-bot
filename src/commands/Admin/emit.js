const { Command } = require('discord-akairo');

module.exports = class emitCmd extends Command {
    constructor() {
        super('emit', {
            aliases: ['emit', 'em'],
            ownerOnly: true,
            channel: 'guild',
            args: [
                {
                    id: 'event',
                },
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: message => message.member
                }
            ],
        });
    }
    exec(message, { event, member }) {

        if(!event) return message.reply('you must provide an event to emit!');

        try {
          this.client.emit(event, member);  
        } catch(err) {
            console.log(`there was an error emiting an event: ${err}`);
            return message.reply('there was an error emiting that event!');
        }
        
        message.util.send(`Emited **${event}** successfully!`);
    }
}