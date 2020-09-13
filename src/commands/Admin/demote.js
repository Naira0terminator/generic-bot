const { Command } = require('discord-akairo');

module.exports = class demoteCmd extends Command {
    constructor() {
        super('demote', {
            aliases: ['demote'],
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'either lack of activity or bad performance',
                },
                {
                    id: 'pm',
                    match: 'flag',
                    flag: '-pm',
                },
            ],
        });
    }
    async exec(message, { member, reason, pm }) {

        if(!member) return message.reply('You must mention a user to demote them!');
        if(message.author.id !== this.client.ownerID || message.member.roles.cache.has('671891148779945997')) 
            return message.reply('You do not have permission to demote members!');

        if(pm) {

            await member.setNickname(member.user.username);
            await member.roles.remove('647399478965305374');
    
            message.util.send(this.client.util.embed()
            .setDescription(`**${member.user.username}** is no longer a pm`)
            .setColor('RED'));
          
            return member.send(this.client.util.embed()
            .setDescription(`${member.user.username}, you are no longer a partner manager on Devils`)
            .setColor('RED'));
        }

        await member.roles.remove(['666448061639426070', '646764542138908675', '663625243470069773', '646764942795472906', '646423843279208469', '671891148779945997'])
        
        message.channel.send(this.client.util.embed()
        .setDescription(`**${member.user.username}** has been demoted`)
        .setColor('RED'));
        
        member.send(this.client.util.embed()
        .setDescription(`**${member.user.username}**, You have been demoted in Devils for ${reason}`)
        .setColor('RANDOM'));
            
    }
}
