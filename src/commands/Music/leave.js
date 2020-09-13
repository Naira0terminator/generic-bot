const { Command } = require('discord-akairo');

module.exports = class leaveCmd extends Command {
    constructor() {
        super('leave', {
            aliases: ['leave', 'begone'],
            channel: 'guild',
            cooldown: 60000,
            description: 'ends the queue and makes the bot leave the current channel',
        });
    }
    async exec(message) {

        const serverQueue = this.client.queue.get(message.guild.id);
        if(!serverQueue) return message.reply('the queue is empthy!');
        if(!serverQueue.voiceChannel) return message.reply('i am not in a voice channel');

        this.client.queue.delete(message.guild.id);
        await serverQueue.voiceChannel.leave();

        message.channel.send(`i have disconnected from ${serverQueue.voiceChannel.name}`)
        
    }
}