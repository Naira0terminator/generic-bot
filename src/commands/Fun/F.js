const { Command } = require('discord-akairo');

module.exports = class fCmd extends Command {
    constructor() {
        super('F', {
            aliases: ['f'],
            description: {
                content: 'pay your respects. or if arguments are provided pay your respects for someone or something',
                examples: ['my nan'],
            },
            args: [{
                id: 'f',
                match: 'content',
                
            }],
        });
    }
    exec(message, { f }) {

        if(f) {

            message.delete();
            const f1 = this.client.util.embed()
            .setDescription(`**${message.member.user.username}** has payed their respects for **${f}**`)
            .setColor('RANDOM')
            return message.util.send(f1);

        }

        message.delete();
        const f2 = this.client.util.embed()
        .setDescription(`**${message.member.user.username}**, has payed their respects`)
        .setColor('RANDOM')
        return message.util.send(f2);

    }
}