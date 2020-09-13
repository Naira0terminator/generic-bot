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
                }
            ]
        });
    }
    async exec(message, { arg }) {

        console.log('hello commit')
    }
}