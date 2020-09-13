const { Command } = require('discord-akairo');

module.exports = class resumeCmd extends Command {
    constructor() {
        super('resume', {
            aliases: ['resume', 'start'],
            lock: 'guild',
            channel: 'guild',
            cooldown: 10000, 
            description: 'resumes the last playing song if it was paused',
        });
    }
    exec(message) {

        const serverQueue = this.client.queue.get(message.guild.id);

        if(serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.reply(`the song has been resumed!`);
        }

        return message.reply('there is nothing playing right now!');
    }
}