const { Command } = require('discord-akairo');

module.exports = class gotoCmd extends Command {
    constructor() {
        super('goto', {
            aliases: ['goto', 'skipto', 'seek'],
            channel: 'guild',
            cooldown: 5000,
            description: {
                content: 'skips to a certain position in the playlist',
                usage: '<position>'
            },
            args: [
                {
                    id: 'position',
                    type: 'integer'
                }
            ]
        });
    }
    async exec(message, { position }) {
        
        const queue = this.client.queue.get(message.guild.id);

        if(!position || position < 0 || position > queue.songs.length) return message.reply('invalid song position!');

        queue.songs = queue.songs.slice(position - 2);
        queue.connection.dispatcher.end();
        
        message.reply(`skipped to ${position}`);
    }
}