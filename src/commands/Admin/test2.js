const { Command } = require('discord-akairo');

module.exports = class Test2Cmd extends Command {
    constructor() {
        super('test2', {
            aliases: ['test2', 't2'],
            lock: 'channel',
            ownerOnly: true,
            args: [
                {
                    id: 'arg',
                    type: 'member',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message, { arg }) {

        message.channel.send(arg.user.username);
    }
}