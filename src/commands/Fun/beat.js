const { Command } = require('discord-akairo');

module.exports = class beatCmd extends Command {
    constructor() {
        super('beat', {
            aliases: ['beat', 'hit', 'abuse'],
            cooldown: 8000,
            channel: 'guild',
            lock: 'channel',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: message => message.member
                }
            ],
        });
    }
    exec(message, { member }) {

        const self = "**" + message.author.username + "**";
        const other = "**" + member.user.username + "**";

        const responses = [
            `${self} brutally beats ${other} into submission`,
            `${other} is beaten mercilessly by ${self}`,
            `${other} gets abused by ${self}`,
            `${self} hulk slams ${other} into the ground`,
            `${self} beats off ${other}! kinky?`,
            `POW SLAM there goes ${other}'s head!`,
            `${self} bullies and abuses ${other}!`
        ]

        let response = responses[Math.floor(Math.random() * responses.length)];

        if(member.id == message.author.id || !member) response = `${self} is beating their own meat tonight...`;

        message.channel.send(this.client.util.embed()
        .setDescription(response)
        .setColor('RANDOM')
        .setFooter('Command issued by kyeun#9715'));
    }
}