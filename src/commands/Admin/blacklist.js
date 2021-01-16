const { Command } = require('discord-akairo');

module.exports = class blacklistCmd extends Command {
    constructor() {
        super('blacklist', {
            aliases: ['blacklist', 'bl'],
            ownerOnly: true,
            channel: 'guild',
            args: [
                {
                    id: 'user',
                    type: 'string'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'all',
                    math: 'flag',
                    flag: '-all'
                }
            ],
        });
    }
    exec(message, {user , reason, flag}) {

        if(!user || !reason)
            return message.reply("You must provide a valid reason and user!");

        user = this.client.users.cache.get(user) || message.mentions.users.first() || this.client.users.cache.find(u => u.username.toLowerCase() === user.toLowerCase());

        if(!user) 
            return;

        if(this.client.qdb.has(`blacklist.[${user.id}]`))
            return message.reply("That user is already blacklisted!");

        this.client.qdb.set(`blacklist.[${user.id}]`, {
            id: user.id,
            reason: reason
        });

        message.channel.send(`**${user.tag}** Has been blacklisted!`);
    }
}