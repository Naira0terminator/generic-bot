const { Listener } = require('discord-akairo');

module.exports = class messageDelete extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete',
        });
    }
    async exec(message) {

        if(message.author.bot) return;

        if(message.content.toLowerCase().match(/nigger|nigga|niggas|niggers|n i g g a|n i g g a|n1gga|n1gger|n¡gga/g)) return;

        const auditLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const deleteLog = auditLogs.entries.first();
        
        // this stores data for the snipe command
        this.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author,
            deletedBy: deleteLog ? deleteLog.executor.tag : null,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        });
    }
}