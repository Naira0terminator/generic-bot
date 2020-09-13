const { Command } = require('discord-akairo');

module.exports = class gayCmd extends Command {
    constructor() {
        super('gay', {
            aliases: ['gay', 'homo'],
            cooldown: 10000,
            lock: 'channel',
            description: 'shows your homo level. the gay rate machine never lies',
            args: [
                {
                id: 'homoMember',
                type: 'member',
                match: 'rest',
                default: message => message.member
                }
            ],
        });
    }
    exec(message, { homoMember }) {
        
        const gayMath = Math.floor(Math.random() * 113);

        const gayEmbed = this.client.util.embed()
        .setAuthor('gay rate', homoMember.user.displayAvatarURL())
        .setDescription(`**${homoMember.user.username}** is \`${gayMath}\`% gay 🏳️‍🌈`)
        .setColor('RANDOM')
        .setFooter('the gay rate machine is 100% accurate') 
        message.util.send(gayEmbed)
    }
}
