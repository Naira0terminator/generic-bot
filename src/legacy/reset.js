const { Command } = require('discord-akairo');
const sleep = require('util').promisify(setTimeout);

module.exports = class resetCmd extends Command {
    constructor() {
        super('reset', {
            aliases: ['reset'],
            channel: 'guild',
            cooldown: 5000,
            description: 'resets the current server queue',
        });
    }
    async exec(message) {
        
        const serverQueue = this.client.queue.get(message.guild.id);
        if(!serverQueue) return message.reply('the queue is empthy!');

        serverQueue.connection.dispatcher.end();

        this.client.queue.delete(message.guild.id);
        message.channel.send('the queue has been reset!');

        await sleep(10000);

        const newQueue = this.client.queue.get(message.guild.id);

        if(!newQueue) return serverQueue.voiceChannel.leave();
        
    }
}