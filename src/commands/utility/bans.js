const { Command } = require('discord-akairo');

module.exports = class bansCmd extends Command {
    constructor() {
        super('baninfo', {
            aliases: ['bans'],
            channelRestriction: 'guild',
            cooldown: 8000,
            description: 'Shows the total ban count for the server.'
        });
    }
    async exec(message) {

        message.guild.fetchBans()
            .then(bans => {
                const embed = this.client.util.embed()
                .addField(`total bans on ${message.guild.name}:`, `${bans.size}`)
                .setColor('RED')
                message.util.send(embed);
            })
            .catch(() => message.channel.send('error getting bans!'));
    }
}
