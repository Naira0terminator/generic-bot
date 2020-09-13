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
            ],
        });
    }
    exec(message, {user , reason}) {

        this.client.qdb.set(`blacklist.[${user}]`, {
            id: user,
            reason: reason
        });

        let getUser = this.client.users.cache.get(user).tag;
        if(!user) getUser = user;

        message.channel.send(`**${getUser}** Has been blacklisted!`);
    }
}