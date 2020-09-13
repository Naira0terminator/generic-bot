const { Command } = require('discord-akairo');

module.exports = class ppCmd extends Command {
    constructor() {
        super('pp', {
            aliases: ['pp', 'penis', 'dick'],
            cooldown: 10000,
            lock: 'channel',
            channel: 'guild',
            description: 'get yours or another members penis size so you can stop feeling bad about your actual tiny penis',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: message => message.member
                },
            ],
        });
    }
    exec(message, { member }) {

        let ppSize = '8';

        const randomNumber = Math.floor(Math.random() * 19);

        for(let i = 0; i < randomNumber; i++) 
            ppSize += '=';
        ppSize += 'D';

        return message.channel.send(this.client.util.embed()
        .setAuthor('PP size machine', member.user.displayAvatarURL())
        .setDescription(`${member.user.username}'s Pp size: **${ppSize}**`)
        .setColor('RANDOM'))
        
    }
}