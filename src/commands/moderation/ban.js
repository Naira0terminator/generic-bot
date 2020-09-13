const { Command, Argument } = require('discord-akairo');

module.exports = class banCmd extends Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            description: {
                content: 'bans a user or server member. if logging is set up it will send the link of the last 250 messages to the logging channel',
                usage: '@member/userID [reason]',
                examples: ['@puthydestroyer69 stealing the last slice of pizza']
            },
            channel: 'guild',
            args: [
                {
                    id: 'userID',
                },
                {
                    id: 'reason',
                    type: "string",
                    match: 'rest',
                }
            ],
        });
    }
    async exec(message, { userID, reason }) {

        const getPerms = await this.client.qdb.get(`guild[${message.guild.id}].perms.ban`);
        const banRole = await message.guild.roles.cache.get(getPerms);

        if(banRole) 
            if(!message.member.roles.cache.has(banRole.id) && !message.member.permissions.has('BAN_MEMBERS')) 
                return message.reply('You do not have permissions to use the ban command!');
        
        if(!userID) return message.reply('you must provide a member to ban!');

        let guildMember = await message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(userID));

        // if the provided user object is a guild member it will do guild member specific checks
        if(guildMember) {
            if(guildMember.id === message.author.id) 
                return message.reply('you\'re too sexy too ban yourself baby ahaha');
            if(guildMember.id === this.client.ownerID) 
                return message.reply('TRAITOR!!!');
            if(guildMember.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('ADMINISTRATOR'))
                return message.reply('Only Administrators with a higher role can ban another Administrators!');
           
            if(message.guild.owner.id !== message.member.id && message.member.roles.highest.rawPosition <= guildMember.roles.highest.rawPosition)
                return message.reply('you cannot ban a member with a role equal to yours or above your highest role!');
        }
        
        // if the provided user object isnt a guild member it will set it to the original argument.
        // and it checks if the user is already banned. its set in this scope cause otherwise it will fail if you try to get it with a mention.
        if(guildMember === null) {
            guildMember = userID;

            //const isBanned = await message.guild.fetchBan(userID || null);
            //if(isBanned) return message.reply('That user is already banned!');
        }

        try {
            // the guildMember value can actually just be a user id which will result in a "hack ban"
            await message.guild.members.ban(guildMember, {days: 7, reason: !reason ? null : `${message.author.tag}: ${reason}`});
        } catch (err) {
            console.log(`Error occured while banning a user in ${message.guild.name}, ${err}`);
            return message.reply('there was an error banning that user!');
        }
        
        message.util.send(`**${ guildMember.user === undefined ? userID : guildMember.user.tag }** has been banned!`);
        
        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);
        const channel = await message.guild.channels.cache.get(logChannel);

        if(logChannel && channel) {
            const logger = await new this.client.modLog('ban', guildMember, message, reason);

            await this.client.sleep(1000);
            logger.log();
        }
        
    }
}