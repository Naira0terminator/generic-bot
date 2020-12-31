const { Command } = require('discord-akairo');
const moment = require('moment');

module.exports = class QueueCmd extends Command {
    constructor() {
        super('queue', {
            aliases: ['queue', 'qu'],
            cooldown: 10000,
            channel: 'guild',
            lock: 'guild',
            clientPermissions: ['SPEAK', 'CONNECT'],
        });
    }
    exec(message) {
        const queue = this.client.queue.get(message.guild.id);

        if(!queue) return message.reply('There is no Queue for this server!');

        let position = 0;
        message.channel.send(this.client.util.embed()
        .setTitle(`${message.guild.name}`)
        .setDescription(`__**Now playing**__: ${queue.songs[0].title}\n\n__**Queue**__:\n${queue.songs.map(song => `\`[${position += 1}]\` - ${song.title}`).join('\n')}`)
        .setColor('RANDOM'));
    }
}