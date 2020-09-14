const { Command } = require('discord-akairo');

module.exports = class roleManager extends Command {
    constructor() {
        super('rm', {
            aliases: ['role-manager', 'rm'],
            cooldown: 5000,
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            channel: 'guild',
            lock: 'guild',
            separator: ',',
            args: [
                {
                    id: 'values',
                    match: 'separate',
                    type: 'string',
                },
                {
                    id: 'c',
                    match: 'flag',
                    flag: '-c',
                },
                {
                    id: 'h',
                    match: 'flag',
                    flag: '-h',
                },
                {
                    id: 'm',
                    match: 'flag',
                    flag: '-m',
                },
                {
                    id: 'n',
                    match: 'flag',
                    flag: '-n',
                }
            ],
        });
    }
    async exec(message, { values, c, h, m, n }) {

        let 
        role = values[0], 
        value = values[1];

        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) || message.guild.roles.cache.get(role) || message.mentions.roles.first();

        if(c) {
            try {
                if(!value.match(/[a-z]+/) && !value.startsWith('#')) value = '#' + value;

                role.setColor(value.match(/[a-z]+/) ? value.toUpperCase() : value);

                return message.reply(`**${role.name}**'s color has been changed to \`${role.hexColor}\``);

            } catch(err) {
                return message.reply(`could not change role! ${err}`);
            }
        }

        else if(h) {
            try {
                let isHoisted;

                if(role.hoist) isHoisted = false;
                if(!role.hoist) isHoisted = true;

                role.setHoist(isHoisted);
                return message.reply(`**${role.name}** has been set to \`${isHoisted ? 'hoisted' : 'not hoisted'}\``);

            } catch(err) {
                return message.reply(`i could not set that role to be hoisted! ${err}`);
            }
        }

        else if(m) {
            try {
               let isMentionable;
               
               if(role.mentionable) isMentionable = false;
               if(!role.mentionable) isMentionable = true;

               role.setMentionable(isMentionable);
               return message.reply(`**${role.name}** has been set to \`${isMentionable ? 'mentionable' : 'UnMentionable'}\``)
            } catch(err) {
                return message.reply(`i could not set that role to be mentionable! ${err}`);
            }
        }

        else if(n) {
            try {
                role.setName(value);
                return message.reply(`**${role.name}**'s name has been changed to \`${value}\``);
            } catch(err) {
                return message.reply(`there was an error changing that roles name! ${err}`);
            }
        }
    }
}