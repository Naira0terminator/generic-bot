const { Command, Argument } = require('discord-akairo');

module.exports = class kickCmd extends Command {
    constructor() {
        super('kick', {
            aliases: ['kick'],
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            channel: 'guild',
            description: {
                content: 'Kicks a server member. if logging is set up it will send the link of the last 250 messages to the logging channel',
                usage: '@member/userID [reason]',
                examples: ['@puthydestroyer69 not petting my dog >:C']
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'reason',
                    match: 'rest',
                }
            ],
        });
    }
    async exec(message, { member, reason }) {

        const getPerms = await this.client.qdb.get(`guild[${message.guild.id}].perms.kick`);
        const kickRole = await message.guild.roles.cache.get(getPerms);

        if(kickRole) 
            if(!message.member.roles.cache.has(kickRole.id) && !message.member.permissions.has('KICK_MEMBERS')) 
                return message.reply('You do not have permissions to use the kick command!');

        if(!member) return message.reply('you must provide a member!');
        if(member.id === message.author.id) return message.reply('you cant kick yourself thats my job!');
        if(!member.bannable) return message.reply('that member cannot be kicked!');
        if(message.guild.owner.id !== message.member.id && message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) 
            return message.reply('you cannot kick members above you!');
        if(member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('ADMINISTRATOR'))
                return message.reply('Only Administrators with a higher role can kick another Administrators!');

        try {
            await member.kick({days: 7, reason: !reason ? null : `${message.author.tag}: ${reason}`});
        } catch (err) {
            console.log(`Error occured while kicking a user in ${message.guild.name}, ${err}`);
            return message.reply('there was an error kicking that user!');
        }

        message.util.send(`**${member.user.tag}** has been kicked!`);

        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);

        if(logChannel) {
            const logger = await new this.client.modLog('kick', member, message.channel, message, reason);
            logger.log();
        }
        
    }
}