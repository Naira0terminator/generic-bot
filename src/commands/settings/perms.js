const { Command, Argument } = require('discord-akairo');

module.exports = class permsCmd extends Command {
    constructor() {
        super('perms', {
            aliases: ['set-perms', 'perms'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 20000,
            channel: 'guild',
            lock: 'guild',
            args: [
                {
                    id: 'perm',
                    type: Argument.compose('lowercase'),
                },
                {
                    id: 'role',
                    type: 'role',
                },
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset',
                }
            ],
        });
    }
    async exec(message, { perm, role, reset }) {

        const permRole = perm => {
            let returnData = this.client.qdb.has(`guild[${message.guild.id}].perms.${perm}`) ? this.client.qdb.get(`guild[${message.guild.id}].perms.${perm}`) : 'No role set'

            if(returnData.match(/\d+/)) {
                const role = message.guild.roles.cache.get(returnData);

                if(!role) returnData = 'Invalid or deleted role - please set it to a valid role';

                else
                    returnData = role;
            }

            return returnData;
        }

        const isSet = perm => {

            if(this.client.qdb.has(`guild[${message.guild.id}].perms.${perm}`)) {
                this.client.qdb.delete(`guild[${message.guild.id}].perms.${perm}`)
                return true;
            }

            else
                return false;
        }

        const setPerms = (perm, role) => {
            if(!role) return message.reply('that is not a valid role!');
            this.client.qdb.set(`guild[${message.guild.id}].perms.${perm}`, role.id);
            message.channel.send(this.client.util.embed()
            .setDescription(`Members with **${role}** can now use the **${perm}** command!`)
            .setColor('RANDOM')
            .setFooter('to reset this you can write the command again without providing a role!'));
        }

        if(reset) {
            this.client.qdb.delete(`guild[${message.guild.id}].perms`);
            return message.reply('permissions for this server have been reset!');
        }

        if(!perm) {
            const prefix = await this.client.settings.get(message.guild.id) || this.client.config.prefix;
            return message.channel.send(this.client.util.embed()
            .setTitle('setting perms')
            .setDescription(`to set perms first provide the command then the role that can use the command (only works for moderation commands)
            \n**Example**: \`${prefix}${this.aliases[0]} ban @staff\`
            \n**Note**: To reset any single perm as long as its already set use the command without a role. I.E \`${prefix}${this.aliases[0]} ban\``)
            .addField('Permissions:', 
            `\`Bans\` ${permRole('ban')}
            \`Kick\` ${permRole('kick')}
            \`MassBan\` ${permRole('massban')}
            \`Mute\` ${permRole('mute')}
            \`Role\` ${permRole('role')}
            \`Purge\` ${permRole('purge')}
            \`Warn\` ${permRole('warn')}`)
            .setColor('RANDOM')
            .setFooter('Make sure the provided role is valid!')); 
        }

        switch(perm) {
            case 'ban':
                if(isSet('ban')) return message.reply('i have reset the role perms for that command!');
                setPerms('ban', role);
            break;
            case 'kick':
                if(isSet('kick')) return message.reply('i have reset the role perms for that command!');
                setPerms('kick', role);
            break;
            case 'massban':
                if(isSet('massban')) return message.reply('i have reset the role perms for that command!');
                setPerms('massban', role);
            break;
            case 'mute':
                if(isSet('mute')) return message.reply('i have reset the role perms for that command!');
                setPerms('mute', role);
            break;
            case 'purge':
                if(isSet('purge')) return message.reply('i have reset the role perms for that command!');
                setPerms('purge', role);
            break;
            case 'role':
                if(isSet('role')) return message.reply('i have reset the role perms for that command!');
                setPerms('role', role);
            break;
            case 'warn':
                if(isSet('warn')) return message.reply('i have reset the role perms for that command!');
                setPerms('warn', role);
            break;
            default:
                message.channel.send('that is not a valid command.')
            break;
        }
    }
}