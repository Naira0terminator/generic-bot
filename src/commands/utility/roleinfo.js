const { Command } = require('discord-akairo');
const {stripIndents} = require('common-tags');
const moment = require('moment');

module.exports = class roleInfo extends Command {
    constructor() {
        super('roleinfo', {
            aliases: ['roleinfo', 'ri'],
            cooldown: 8000,
            channel: 'guild',
            description: {
                content: 'returns information on a server role. if you add \`-m\` to the message it will show you all the members in that role',
                examples: ['epic role', '-m someRole'],
            },
            args: [
                {
                    id: 'mems',
                    match: 'flag',
                    flag: '-m'
                },
                {
                    id: 'role',
                    match: 'rest',
                },
            ],
        });
    }
    exec(message, { role, mems }) {

        if(!role) return message.reply('you must provide a role!');
        const rFind = message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) || message.guild.roles.cache.get(role);
        if(!rFind) return message.reply('i could not find that role')

        let roleColor = rFind.hexColor;
        let roleColor2 = rFind.hexColor;

        if(roleColor === '#000000') roleColor = 'RANDOM';
        if(roleColor2 === '#000000') roleColor2 = 'default color';

        
        if(mems) {
            let mapMembers = rFind.members.map(m => m.user).join(' ');
            if(rFind.members.size > 50) mapMembers = 'too many members in this role!';

            const embed = this.client.util.embed()
            .setTitle(rFind.name)
            .setDescription(mapMembers)
            .setColor(roleColor)
            .setFooter(`${rFind.members.size} members in ${rFind.name}`)
            return message.channel.send(embed);
        }

        const embed = this.client.util.embed() 
        .setTitle(rFind.name)
        .setDescription(stripIndents`
        **Members in role**: \`${rFind.members.size}\`
        **Created at**: \`${moment.utc(rFind.createdAt).format('dddd, MMMM Do YYYY, HH:mm')}\`
        **Hex color**: \`${roleColor2}\``)
        .setColor(roleColor)
        .setFooter(`ID (${rFind.id})`)
        message.util.send(embed);
        
    }
}