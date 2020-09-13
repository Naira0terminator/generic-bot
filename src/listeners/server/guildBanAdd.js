const { Listener } = require('discord-akairo');

module.exports = class newBan extends Listener {
    constructor() {
        super('newban', {
            event: 'guildBanAdd',
            emitter: 'client',
        });
    }
    async exec(guild, user) {

        const auditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        let banData;
        const lastBan = auditLogs.entries.first();

        if(!lastBan) banData = null;

        const { executor, target, reason } = lastBan;

        banData = {
            author: executor,
            authorTag: executor.tag,
            authorAvatar: executor.displayAvatarURL(),
            authorID: executor.id,
            target: target,
            targetTag: target.tag,
            targetAvatar: target.displayAvatarURL(),
            targetID: target.id,
            reason: reason,

        };

        if(this.client.qdb.has(`${guild.id}-Lastban`))
            await this.client.qdb.delete(`${guild.id}-Lastban`);

        await this.client.qdb.set(`${guild.id}-Lastban`, banData);

        const logChannel = await this.client.qdb.get(`guild[${guild.id}].logChannels.mod`);

        const channel = guild.channels.cache.get(logChannel);
        if(!channel) return;

        if((logChannel && executor.id !== this.client.user.id) || (logChannel && reason.startsWith('mass banned by:'))) {
            // does not use the logger class since their is no message to work on.
            channel.send(this.client.util.embed()
            .setAuthor(`${user.tag} Banned 🔨`, user.displayAvatarURL())
            .setDescription(reason.startsWith('mass banned by:') ? "" : `This ban was not made through ${this.client.user.username}`)
            .addField('Moderator', executor, true)
            .addField(`Reason`, reason ? reason : `(No reason provided)`)
            .setFooter(`Target ID (${user.id})`)
            .setTimestamp()
            .setColor('RED'));
        }
    }
}