const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }
    exec(message, command, reason)  {

        const time = new Date();
        let ch = message.channel.name;
        if(ch === undefined) ch = 'DM';

        const reply = {
            owner: `**${command}** is only usable by the bot owner`,
            userPermissions: `you do not have permission to use **${command}**`,
            dm: `**${command}** is only usable in direct messages`,
            guild: `**${command}** can only be used in a server`,
        }[reason];
        
        console.log('info', `\n\nBlocking service:\n\nuser: ${message.author.username} | ${message.author.id}\nCommand: ${command.id}\nreason: ${reason}\nChannel: ${ch}\nTime: ${time}`);

        if(!reply) return message.reply(`you cannot use **${command}**`);
        return message.reply(reply);
    }
}
