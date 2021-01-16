const { Inhibitor } = require('discord-akairo');

module.exports = class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklistInhibitor', {
            reason: 'blacklist',
            priority: 1,
            type: 'all'
        })
    }
    exec(message) {
        return this.client.qdb.has(`blacklist.[${message.author.id}]`);
    }
}
