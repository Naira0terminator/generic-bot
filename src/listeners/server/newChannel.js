const { Listener } = require('discord-akairo');

module.exports = class newChannel extends Listener {
    constructor() {
        super('newchannel', {
            emitter: 'client',
            event: 'channelCreate',
        });
    }
    async exec(channel) {
        if(channel.type === 'text') {
            if(this.client.guild.me.permissions.has('MANAGE_CHANNELS')) {
                const getRoleID = await this.client.qdb.get(`muteRole[${channel.guild.id}]`)
                const muteRole = channel.guild.roles.cache.get(getRoleID);
                if(!muteRole || !getRoleID) return;
                
                channel.updateOverwrite(muteRole, { SEND_MESSAGES: false})
            }
        }
        
    }
}