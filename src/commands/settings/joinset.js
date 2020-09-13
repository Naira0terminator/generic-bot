const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class joinSetCmd extends Command {
    constructor() {
        super('joinset', {
            aliases: ['welcome-setting', 'join'],
            clientPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            description: {
                content: stripIndents`Sets the new member join channel and message.\nif you do not provide a channel it will default to the current channel.\n\n
                **Formats**: \`{memberName} | {memberMention} | {serverName} | {memberCount}\``,
                usage: '<channel> welcome message',
                examples: ['#epicChannel welcome to {serverName} enjoy your stay {memberMention}']
            },
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                    default: message => message.channel,
                },
                {
                    id: 'msg',
                    type: 'string',
                    match: 'rest',
                    default: 'welcome to this cool server.'
                },
                {
                    id: 'setEmbed',
                    match: 'flag',
                    flag: '-embed',
                },
                {
                    id: 'emit',
                    match: 'flag',
                    flag: '-emit',
                }
            ],
        });
    }
    async exec(message, { channel, msg, emit }) {

        if(emit) 
            return this.client.emit('guildMemberAdd', message.member);
        
        if(!channel) return message.reply('you must provide a valid text channel and join message!');

        await this.client.qdb.set(`guild[${message.guild.id}].join`, {
            channel: channel.id,
            message: msg,
            embed: false,
        });
        
        message.channel.send(this.client.util.embed()
        .setDescription(`**Channel**: ${channel}\n**Message**: ${msg}`)
        .setColor('GREEN')
        .setFooter(`Use <prefix>${this.aliases[0]} -emit to show the formated message!`));
    }
}