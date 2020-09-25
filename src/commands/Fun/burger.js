const { Command } = require('discord-akairo');

module.exports = class burgerCmd extends Command {
    constructor() {
        super('burger', {
            aliases: ['burger', 'borger'],
            cooldown: 8000,
            lock: 'channel',
            channel: 'guild',
            description: 'Booster command issued by stroke boy',
            args: [{id: 'member', type: 'member', match: 'rest', default: message => message.member}],
        });
    }
    exec(message, { member }) {

        message.channel.send(this.client.util.embed()
        .setDescription(`i shoved a burger in **${member.user.username}**'s mouth!`)
        .setColor('RANDOM')
        .setFooter('custom command issued by Andy'));
    }
}