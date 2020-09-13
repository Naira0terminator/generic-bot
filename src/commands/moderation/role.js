const { Command } = require('discord-akairo');

module.exports = class roleCmd extends Command {
    constructor() {
        super('role', {
            aliases: ['role', 'r'],
            channel: 'guild',
            description: {
                content: 'a command for adding and removing roles to and from a user',
                usage: '<memberMention/memberID> <roleName/RoleID/RoleMention>',
                examples: ['@epicName coolRole'],
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'role',
                    match: 'rest',
                },
                
            ],
        });
    }
    async exec(message, { role, member }) {

        if(!member) return message.reply('you must provide a member!');
        if(!role) return message.reply('you must provide a role!');

        const rFind = message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) || message.guild.roles.cache.get(role) || message.mentions.roles.first();
        if(!rFind) return message.reply('i cannot find that role');

        const staffRole = await this.client.qdb.get(`guild[${message.guild.id}].perms.role`);
        if(!staffRole) return;

        if(!message.member.roles.cache.has(staffRole)) 
            return message.reply(`you require staff to use this command or manage roles permissions`);
  
        if(message.guild.owner.id !== message.member.id && rFind.rawPosition >= message.member.roles.highest.rawPosition) 
            return message.reply('you do not have permission to manage that role');

        const embed = this.client.util.embed();

        if(member.roles.cache.has(rFind.id)) {
            member.roles.remove(rFind.id);
            embed.setDescription(`${rFind} has been removed from **${member.user.username}**`)
            embed.setColor('RED')
            return message.util.send(embed);
        }

        member.roles.add(rFind.id);
        embed.setDescription(`${rFind} has been added to **${member.user.username}**`)
        embed.setColor('GREEN')
        return message.util.send(embed);
    }
}