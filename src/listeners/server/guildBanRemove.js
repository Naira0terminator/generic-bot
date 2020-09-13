const { Listener } = require('discord-akairo');

module.exports = class banRemove extends Listener {
    constructor() {
        super('banremove', {
            emitter: 'client',
            event: 'guildBanRemove',
        });
    }
    async exec(guild, user) {

        this.client.qdb.set(`${guild.id}-lastUnban`, {
            tag: user.tag,
            avatar: user.displayAvatarURL(),
            id: user.id,
        });
        
        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });

        let banData;
        const lastBan = auditLogs.entries.first();

        if(!lastBan) banData = null;

        const { executor, target, reason } = lastBan;

        const logChannel = await this.client.qdb.get(`guild[${guild.id}].logChannels.mod`);

        const channel = guild.channels.cache.get(logChannel);
        if(!channel) return;

        if(logChannel && executor.id !== this.client.user.id) {
            // does not use the logger class since their is no message to work on.
            channel.send(this.client.util.embed()
            .setAuthor(`${user.tag} Unbanned 🔓`, user.displayAvatarURL())
            .addField('Moderator', executor, true)
            .addField(`Reason`, reason ? reason : `(No reason provided)`)
            .setFooter(`Target ID (${user.id})`)
            .setTimestamp()
            .setColor('YELLOW'));
        }
    }
}