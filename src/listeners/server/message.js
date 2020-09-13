const { Listener } = require('discord-akairo');
const moment = require('moment');

module.exports = class baseMessage extends Listener {
    constructor() {
        super('message', {
            event: 'message',
            emitter: 'client',
        });
    }
    async exec(message) {
        
        if(message.author.bot || message.channel.type === 'dm') return;

        await this.client.redis.zincr(`guild[${message.guild.id}]-userMessages`, 1, `${message.author.id}`);

        let messageToLog = `\n${message.author.tag} (ID: ${message.author.id}) [${moment.utc(message.createdAt).format('DD/MM/YYYY hh:mm:ss')}]\n${message.content}\n\n`

        if(message.attachments.first()) messageToLog = `\n${message.author.tag} (ID: ${message.author.id}) - ${moment.utc(message.createdAt).format('dddd, MMMM Do YYYY, HH:mm')}\n${message.attachments.first().proxyURL || null}\n`;

        const llen = await this.client.redis.llen(`messages-${message.channel.id}`);
        if(llen > 251) await this.client.redis.lpop(`messages-${message.channel.id}`);

        await this.client.redis.rpush([`messages-${message.channel.id}`, messageToLog]);
    }
}