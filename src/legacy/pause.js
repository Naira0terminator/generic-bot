const { Command } = require('discord-akairo');
const { VoiceChannel } = require('discord.js');

module.exports = class pauseCmd extends Command {
    constructor() {
        super('pause', {
            aliases: ['pause', 'stop'],
            lock: 'guild',
            channel: 'guild',
            cooldown: 10000, 
            description: 'pauses the current song playing!',
        });
    }
    exec(message) {

        const serverQueue = this.client.queue.get(message.guild.id);
        const { channel } = message.member.voice;

        if(serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.reply(`the song has been paused!`);
        }

        message.reply('there is nothing playing right now!');

        setTimeout(async () => {
            if(serverQueue.playing === false) {
                await channel.leave();
                serverQueue.connection.dispatcher.end();
                this.client.queue.delete(message.guild.id);
            }
        }, 60000);
    }
}