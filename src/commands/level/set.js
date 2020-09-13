const { Command } = require('discord-akairo');

module.exports = class setLevel extends Command {
    constructor() {
        super('lvlset', {
            aliases: ['set'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member,
                },
                {
                    id: 'value',
                    type: 'integer',
                }, 
                {
                    id: 'xp',
                    match: 'flag',
                    flag: 'xp',
                }
            ],
        });
    }
    async exec(message, { member, value, xp }) {

        if(xp && value) {
            const xpAdd = await this.client.redis.zincr(`guild[${message.guild.id}]-exp`, value, `${member.id}`);
            return message.channel.send(`Added \`${xpAdd}\` EXP to **${member.user.username}**`);
        }

        if(!member || !value) return message.reply('you must provide a member and a value!');
        
        await this.client.redis.zadd(`guild[${message.guild.id}]-exp-level`, value, `${member.id}`);
        const currentLevel = await this.client.redis.zscore(`guild[${message.guild.id}]-exp-level`, `${member.id}`);

        const replace = await this.client.redis.get(`guild[${message.guild.id}]-exp-replace`);
        if(replace === 'on') {
            const values = await this.client.redis.hgetall(`guild[${message.guild.id}]-levelRoles`);
            const roleArray = Object.entries(values).reverse();
            for(const object of roleArray) {
                if(object[0] <= currentLevel) {
                    const getRole = message.guild.roles.cache.get(object[1]);
                    if(getRole) 
                        await member.roles.add(getRole);
                    break;
                }
            }
        }

        else {
            const values = await this.client.redis.hgetall(`guild[${message.guild.id}]-levelRoles`);
            for(const object of Object.entries(values)) {
                if(object[0] <= currentLevel) {
                    const getRole = message.guild.roles.cache.get(object[1]);
                    if(getRole)
                        await member.roles.add(getRole);
                }
            }
        }
        
        for(let i = 0; i < currentLevel + 1; i++) {
            if(i > currentLevel) break;
            if(this.client.redis.hexists(`guild[${message.guild.id}]-exp-reward`, `reward-${i}`)) {
                const levelRole = await this.client.redis.hget(`guild[${message.guild.id}]-exp-reward`, `reward-${i}`);
                const role = message.guild.roles.cache.get(levelRole);
                if(role) {
                    await member.roles.add(role.id);
                }
            }
        }

        message.channel.send(`**${member.user.tag}** level has been set to \`${currentLevel}\``);
    }
}