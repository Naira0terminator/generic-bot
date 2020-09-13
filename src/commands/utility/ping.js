const { Command } = require('discord-akairo'); 

module.exports = class PingCmd extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Shows the response time of the webhook latancy and the message latancy'
        });
    }
    async exec(message) {
    
        const sent = await message.util.send('pinging...');
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        
        return message.util.send(this.client.util.embed()
        .setDescription(`**Websocket Latancy**: \`${Math.round(this.client.ws.ping)} MS\`\n**message**: \`${timeDiff} MS\``)
        .setColor('RANDOM'));
        
    }
}