const { Listener } = require('discord-akairo');

module.exports = class disconnectEvent extends Listener {
    constructor() {
        super('disconnect', {
            emitter: 'client',
            event: 'shardDisconnect',
        });
    }
    exec(closeInfo) {

        if(!closeInfo) {
            console.log(`${this.client.user.username} has disconnected unexpectedly`);
            process.exit();
        }
        console.log(`${this.client.user.username} has disconnected: ${closeInfo.code}`);
        process.exit();
    }
}