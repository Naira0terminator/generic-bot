const { Listener } = require('discord-akairo');
const ms = require('ms');

module.exports = class CooldownListener extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown',
        });
    }

    async exec(message, command, remaining) {
        
        const wait = require('util').promisify(setTimeout);
        const sendMessage = await message.reply(`**${command}** is on cooldown you must wait **${ms(remaining, {long: true})}** to use it again!`);
        await wait(5000);
        await sendMessage.delete();
    }
}
