const { Command, Argument } = require('discord-akairo');

module.exports = class unbanCmd extends Command {
    constructor() {
        super('unban', {
            aliases: ['unban'],
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            description: 'A command for unbaning any valid user.',
            channel: 'guild',
            args: [
                {
                    id: 'userID'
                },
                {
                    id: 'reason',
                    match: 'rest',
                    default: null,
                },
            ],
        });
    }
    async exec(message, { userID, reason }) {

        try {
            await message.guild.members.unban(userID, {reason: !reason ? null : `${message.author.tag}: ${reason}`});
        } catch(err) {
            return message.reply(`there was an error unbanning that user: ${err}`);
        }

        message.util.send(`**${userID}** has been unbanned!`);

        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);

        if(logChannel) {
            const logger = new this.client.modLog('unbanned', userID, message, reason);
            await logger.log();
        }
        
    }

}