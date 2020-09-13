const { Command } = require('discord-akairo');

module.exports = class queueCmd extends Command {
    constructor() {
        super('queue', {
            aliases: ['queue', 'qu'],
            channel: 'guild',
            cooldown: 5000,
            description: 'gets the current server queue',
        });
    }
    exec(message) {
        
        const serverQueue = this.client.queue.get(message.guild.id);
        let position = 0

        if(!serverQueue) return message.reply('their is nothing playing right now!');

        const embed = this.client.util.embed()
        .setTitle(`${message.guild.name}`)
        .setDescription(`__**Now playing**__: ${serverQueue.songs[0].title}\n\n__**Queue**__:\n${serverQueue.songs.map(song => `\`[${position += 1}]\` - ${song.title}`).join('\n')}`)
        .setColor('RANDOM')
        message.channel.send(embed);
    }
}