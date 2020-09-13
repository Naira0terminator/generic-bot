const { Command } = require('discord-akairo');

module.exports = class unmuteCmd extends Command {
    constructor() {
        super('unmute', {
            aliases: ['unmute'],
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            description: {
                content: 'Unmutes the user if they are muted.',
                usage: '@user <reason>',
                examples: ['@user good boi']
            },
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                }
            ],
        }) ;
    }
    async exec(message, { member, reason }) {

        const muteRole = await this.client.qdb.get(`muteRole[${message.guild.id}]`);
        let removeRoles = await this.client.qdb.get(`muteRemove[${message.guild.id}]`);

        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);
        const getRole = await message.guild.roles.cache.get(muteRole);

        if(!muteRole || !getRole) return message.reply("There is no valid mute role set. setup one with the \`Mute-setup\` command!");

        if(!member) return message.util.reply('Please provide a valid member');
        if(message.guild.owner.id !== message.member.id && message.member.roles.highest.rawPosition <= member.roles.highest.rawPosition) 
            return message.reply('you cannot Mute members above you!');
        if(!member.roles.cache.has(getRole.id))
            return message.util.reply('That user is not Muted');

        for(const role of removeRoles) {
            const r = message.guild.roles.cache.get(role);
            if(!r) {
                removeRoles = removeRoles.filter(id => id === r);
                this.client.qdb.set(`muteRemove[${message.guild.id}]`, removeRoles);
            }
        }

        const premuteRoles = this.client.qdb.get(`user[${member.id}].premuteRoles`);
        await member.roles.add(premuteRoles);
        await member.roles.remove(getRole.id);

        message.util.send(this.client.util.embed()
        .setDescription(`**${member.user.username}** Has been unmuted | 🔊`)
        .setColor('GREEN'));

        this.client.qdb.set(`user[${member.id}].moderation.muteData`, {
            muted: false,
            count: this.client.qdb.has(`user[${member.id}].moderation.muteData.count`) ? 
            this.client.qdb.has(`user[${member.id}].moderation.muteData.count`) : 1,
        });

        if(logChannel) {
            const logger = await new this.client.modLog('unmuted', member, message, reason);
            logger.log();
        }
    }
}