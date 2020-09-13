const { Listener } = require('discord-akairo');

module.exports = class messageEdit extends Listener {
    constructor() {
        super('messageedit', {
            event: 'messageUpdate',
            emitter: 'client',
        });
    }
    exec(oldmsg, newmsg) {
        
        if(newmsg.author.bot) return;

        if(newmsg.content.toLowerCase().match(/nigger|nigga|niggas|niggers|n i g g a|n i g g a|n1gga|n1gger|n¡gga/g)) return;
        
        // this stores data for the snipe command
        this.client.snipes.set(`edit-${newmsg.channel.id}`, {
            newcontent: newmsg.content,
            oldcontent: oldmsg.content,
            author: newmsg.author,
        });

    }
}