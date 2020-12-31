const { Command } = require('discord-akairo');

module.exports = class skipCmd extends Command {
    constructor() {
        super('skip', {
            aliases: ['skip'],
            channel: 'guild',
            lock: 'guild',
            cooldown: 10000,
            description: 'skips to the next song in the play list'
        });
    }
    exec(message) {

        const { channel } = message.member.voice;
        const serverQueue = this.client.queue.get(message.guild.id);

        if(!channel) return message.reply('you must be in a voice channel to skip songs!');
        if(!serverQueue) return message.reply('there is nothing playing right now!');

        serverQueue.connection.dispatcher.end(`skipped by ${message.author.tag}`);
        message.util.send('song skipped!');
    }
}