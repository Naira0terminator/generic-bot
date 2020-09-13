const { Command } = require('discord-akairo');

module.exports = class dieCmd extends Command {
    constructor() {
        super('die', {
            aliases: ['die', 'shutdown'],
            ownerOnly: true,
        });
    }
    async exec(message) {

        const embed = this.client.util.embed()
        .setDescription('Shutting down...')
        .setColor('RED')
        await message.util.send(embed).then(() => process.exit());
       
    }
}