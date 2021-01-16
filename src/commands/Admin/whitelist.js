const { Command } = require('discord-akairo');

module.exports = class whitelistCmd extends Command {
    constructor() {
        super('whitelist', {
            aliases: ['whitelist', 'wl'],
            ownerOnly: true,
            channel: 'guild',
            args: [
                {
                    id: 'user',
                    type: 'string'
                },
            ],
        });
    }
    exec(message, {user}) {

        if(!user)
            return message.reply("You must provide a user!");

        user = this.client.users.cache.get(user) || message.mentions.users.first() || this.client.users.cache.find(u => u.username.toLowerCase() === user.toLowerCase());

        if(!user) 
            return;

        if(!this.client.qdb.has(`blacklist.[${user.id}]`))
            return message.reply("That user is not blacklisted!");

        this.client.qdb.delete(`blacklist.[${user.id}]`);

        message.channel.send(`**${user.tag}** Has been whitelisted!`);
    }
}