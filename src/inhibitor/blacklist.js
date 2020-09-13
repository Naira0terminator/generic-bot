const { Inhibitor } = require('discord-akairo');

module.exports = class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklistInhibitor', {
            reason: 'blacklist',
            type: 'all'
        })
    }
    exec(message) {
        const blacklist = this.client.qdb.get(`blacklist.[${user}]`)
        return blacklist.id === message.author.id;
    }
}
