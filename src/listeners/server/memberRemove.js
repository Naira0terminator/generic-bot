const { Listener } = require('discord-akairo');
const moment = require('moment');
const ms = require('ms');

module.exports = class memberRemove extends Listener {
    constructor() {
        super('memberRemove', {
            event: 'guildMemberRemove',
            emitter: 'client',
        });
    }
    async exec(member) {

        const Ison = await this.client.redis.get(`guild[${member.guild.id}]-exp-leaver`);

        if(Ison === 'on') {
            await this.client.redis.zrem(`guild[${member.guild.id}]-exp`, `${member.id}`);
            await this.client.redis.zrem(`guild[${member.guild.id}]-exp-level`, `${member.id}`);
        }

        const data = await this.client.newMember.get(`${member.guild.id}-${member.id}`);
        if(!data) return;
        
        const now = moment(new Date());
        const channel = await member.guild.channels.cache.get(data.messageChannel)
        channel.messages.fetch(data.messageID)
            .then(async message => {
                if(!message) return;

                await message.edit(this.client.util.embed()
                .setAuthor(member.user.username, member.user.displayAvatarURL())
                .setDescription(`the member has left the server! joined **${ms(now.diff(data.userJoinDate, 'seconds') * 1000, {long: true})}** ago`)
                .setColor('RANDOM')
                .setFooter(`Member count: ${member.guild.members.cache.size}`));
            })
        

        const auditLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const lastEntry = auditLogs.entries.first();
        if(!lastEntry) return;

        const { executor, target, reason } = lastEntry;
        const logChannel = await this.client.qdb.get(`guild[${member.guild.id}].logChannels.mod`); 
        const getChannel = member.guild.channels.cache.get(logChannel);
        const muteRoleID = await this.client.qdb.get(`muteRole[${member.guild.id}]`);
        const muteRole = await member.guild.roles.cache.get(muteRoleID)

        if(member.roles.cache.has(muteRole.id)) {
            member.guild.members.ban(member, {days: 7, reason: 'Automoderator: banned for leaving while Muted.'})
           
           if(logChannel) {
                getChannel.send(this.client.util.embed()
                .setTitle('Automoderator Action')
                .setDescription(`**${member.user.tag}** has been banned for leaving while ${muteRole}`)
                .setColor('RED')
                .setFooter(`target ID (${member.id})`));
           }
           
        }

        if(target.id === member.id && logChannel) {
            getChannel.send(this.client.util.embed()
            .setAuthor(`${member.user.tag} Kicked 👢`, member.user.displayAvatarURL())
            .setDescription(`This ban was not made through ${this.client.user.username}`)
            .addField('Moderator', executor, true)
            .addField(`Reason`, reason ? reason : `(No reason provided)`)
            .setFooter(`Target ID (${member.id})`)
            .setTimestamp()
            .setColor('YELLOW'))
        }
    }
}