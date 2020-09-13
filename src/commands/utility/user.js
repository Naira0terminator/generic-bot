const { Command } = require('discord-akairo');
const moment = require('moment');

module.exports = class fetchMemberCmd extends Command {
    constructor() {
        super('user', {
            aliases: ['user', 'getmember', 'fetch'],
            cooldown: 6000,
            description: {
                content: 'returns a user from given arguments: ID, username, mention',
                usage: '<mention/name/id>',
                examples: ['little devil'],
            },
            channelRestriction: 'guild',
            args: [{
                id: 'member',
                type: 'member',
                match: 'rest',
                default: message => message.member,
            }],
        });
    }
    async exec(message, { member }) {
        
        const { user } = member;
        const dateNow = moment(new Date());
        const timeDiff = time => `${dateNow.diff(time, 'years')} years, ${dateNow.diff(time, 'months')} months, ${dateNow.diff(time, 'days')} days, ${dateNow.diff(time, 'hours')} hours, ${dateNow.diff(time, 'minutes')} minutes`

        const embed = this.client.util.embed() 
        .setAuthor(user.tag)
        .setDescription(user)
        .addField('Join date: ', moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm'), true)
        .addField('Account created at: ', `${timeDiff(user.createdAt)} ago (${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm')})`, true)
        .setColor(member.displayHexColor)
        .setThumbnail(user.displayAvatarURL())
        .setFooter(`ID: ${user.id}`)
        message.util.send(embed);

        
    }
}