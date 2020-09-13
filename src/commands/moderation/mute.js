const { Command } = require('discord-akairo');
const ms = require('ms');

module.exports = class muteCmd extends Command {
    constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'shush', 'quiet'],
            description: {
                content: 'Mutes the user for a given amount of time. setup the mute settings with the mute-settings command.',
                usage: '@user <time> <reason>',
                examples: ['@user 10m spamming']
            },
            userPermissions: 'MANAGE_ROLES',
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'time',
                    default: '5m',
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                }
            ],
        });
    }
    async exec(message, { member, time, reason}) {
        
        const muteRole = await this.client.qdb.get(`muteRole[${message.guild.id}]`);
        let removeRoles = await this.client.qdb.get(`muteRemove[${message.guild.id}]`);

        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);
        const getRole = await message.guild.roles.cache.get(muteRole);

        if(!muteRole || !getRole) return message.reply("There is no valid mute role set. setup one with the \`Mute-setup\` command!");
        
        if(!member) return message.util.reply('Please provide a valid member');
        if(message.guild.owner.id !== message.member.id && message.member.roles.highest.rawPosition <= member.roles.highest.rawPosition) 
            return message.reply('you cannot Mute members above you!');
        if(member.roles.cache.has(getRole.id))
            return message.util.reply('That user is already Muted');

        for(const role of removeRoles) {
            const r = message.guild.roles.cache.get(role);
            if(!r) {
                removeRoles = removeRoles.filter(id => id === r);
                this.client.qdb.set(`muteRemove[${message.guild.id}]`, removeRoles);
            }
            if(member.roles.cache.has(role)) {
                this.client.qdb.push(`user[${member.id}].premuteRoles`, role)
            }
        }

        await member.roles.add(getRole.id);
        await member.roles.remove(removeRoles);

        if(!member.roles.cache.has(getRole.id))
            await member.roles.add(getRole.id);
        
        message.util.send(this.client.util.embed()
        .setDescription(`**${member.user.username}** Has been muted | 🔇`)
        .setColor('GREEN')
        .setFooter(`Duration: ${ms(ms(time), {long: true})}`));

        this.client.qdb.set(`user[${member.id}].moderation.muteData`, {
            muted: true,
            duration: ms(time),
            count: this.client.qdb.has(`user[${member.id}].moderation.muteData.count`) ? 
            this.client.qdb.has(`user[${member.id}].moderation.muteData.count`) : 1,
        });

        if(logChannel) {
            const logger = await new this.client.modLog('muted', member, message, reason);

            logger.log();
        }

        const taskManager = new this.client.taskManager('mute', ms(time), {message: message, member: member });
        await taskManager.set();

    } 
}