const { Command } = require('discord-akairo');

module.exports = class SkipCmd extends Command {
    constructor() {
        super('skip', {
            aliases: ['skip', 'next'],
            cooldown: 10000,
            channel: 'guild',
            lock: 'guild',
            clientPermissions: ['SPEAK', 'CONNECT'],
        });
    }
    async exec(message) {
        const { channel } = message.member.voice;
        if(!channel) return message.reply('you must be in a voice channel to skip songs!');

        const queue = this.client.queue.get(message.guild.id);

        if(!queue) return message.reply('There is nothing playing!');

        queue.songs.length ? await queue.player.stop() : queue.player.disconnect(true);
        message.channel.send('song has been skipped!');
    }
}