const { Listener } = require('discord-akairo');

module.exports = class errorHandler extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error',
        });
    }
    exec(err, message, command) {

        console.log(`there was an error executing ${command}, Stack: ${err.stack}`);

        message.channel.send(`There was an error executing **${command}**.`);
    }
}