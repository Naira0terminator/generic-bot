const { Command, Argument } = require('discord-akairo');

module.exports = class levelRole extends Command {
    constructor() {
        super('lvlrole', {
            aliases: ['level-role', 'lrole'],
            channel: 'guild',
            lock: 'guild',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'level',
                    type: 'integer',
                },
                {
                    id: 'role',
                    type: Argument.compose('lowercase'),
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all',
                },
                {
                    id: 'reward',
                    match: 'flag',
                    flag: '-reward',
                }
            ],
        });
    }
    async exec(message, { level, role, all, reward }) {

        if(all) {

            const getRoles = await this.client.redis.hgetall(`guild[${message.guild.id}]-levelRoles`);
            const rewards = await this.client.redis.hgetall(`guild[${message.guild.id}]-exp-reward`);

            if(!getRoles) message.reply('no roles have been set for this server!');

            const embed = this.client.util.embed()
            .setColor('RANDOM')
            .addField('Level roles',
                Object.entries(getRoles)
                .filter(role => message.guild.roles.cache.has(role[1]))
                .map(key => {
                    const getRole = message.guild.roles.cache.get(key[1]);
                    return `${key[0]}: ${getRole}\n`;
                }) 
            );

            if(rewards) {
                embed.addField('Reward roles', 
                Object.entries(rewards)
                .filter(role => message.guild.roles.cache.has(role[1]))
                .map(key => {
                    const getRole = message.guild.roles.cache.get(key[1]);
                    return `${key[0].replace('reward-', '')}: ${getRole}\n`;
                }));
            }

            return message.channel.send(embed);
        }

        if(reward) {
            if(!role) {
                if(await this.client.redis.hexists(`guild[${message.guild.id}]-exp-reward`, `reward-${level}`)) {
                    await this.client.redis.hdel(`guild[${message.guild.id}]-exp-reward`, `reward-${level}`);
                    return message.reply(`reward role for level **${level}** have been reset!`);
                }
                return message.reply('you must provide a valid role!');
            }
            
            if(isNaN(level)) return message.reply('you must provide a valid number for the level and a valid role!');

            const findRewardRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === role) || message.guild.roles.cache.get(role) || message.mentions.roles.first();
            await this.client.redis.hset(`guild[${message.guild.id}]-exp-reward`, `reward-${level}`, findRewardRole.id);
            return message.channel.send(`Members with level **${level}** will now recieve **${findRewardRole.name}**`);
        }

        if(!role) {
            if(await this.client.redis.hexists(`guild[${message.guild.id}]-levelRoles`, level)) {
                await this.client.redis.hdel(`guild[${message.guild.id}]-levelRoles`, level);
                return message.reply(`level role for level **${level}** have been reset!`);
            }
            return message.reply('you must provide a valid role!');
        }
        
        if(isNaN(level)) return message.reply('you must provide a valid number for the level and a valid role!');

        const findRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === role) || message.guild.roles.cache.get(role) || message.mentions.roles.first();
        await this.client.redis.hset(`guild[${message.guild.id}]-levelRoles`, level, findRole.id);
        return message.channel.send(`Members with level **${level}** will now recieve **${findRole.name}**`);
    }
}