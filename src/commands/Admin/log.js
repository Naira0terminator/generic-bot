const { Command } = require('discord-akairo');
const hastebin = require('hastebin');

module.exports = class logCmd extends Command {
    constructor() {
        super('log', {
            aliases: ['log'],
            lock: 'channel',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'get',
                    type: 'integer',
                    default: 250
                },
                {
                    id: 'channel',
                    type: 'channel',
                    default: message => message.channel,
                },
            ]
        });
    }
    async exec(message, { get, channel }) {
        
        if(get > 250) return message.reply('post must be 250 or less');
        const messages = await this.client.redis.lrange(`messages-${message.channel.id}`, 0, -1);

        hastebin.createPaste(messages.join(' '), {
            raw: false,
            contentType: 'text/plain',
            server: 'https://haste.unbelievaboat.com/'
        })
        .then(url => message.channel.send(this.client.util.embed()
        .setAuthor(`${message.author.username} | Web Logs`, message.author.displayAvatarURL())
        .setDescription(`[Link](${url + '.txt'})`)
        .setColor('RANDOM')))
        .catch(err => message.channel.send(`error posting ${err}`));
    }
}