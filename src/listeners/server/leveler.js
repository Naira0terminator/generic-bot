const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');

module.exports = class Leveler extends Listener {
    constructor() {
        super('leveler', {
            event: 'message',
            emitter: 'client'
        });
    }
    async exec(message) {

        if(message.author.bot || message.channel.type === 'dm') return;

        const channelBl = await this.client.redis.smembers(`guild[${message.guild.id}]-exp-blacklist-channel`);
        if(channelBl.includes(message.channel.id)) return;

        const roleBl = await this.client.redis.smembers(`guild[${message.guild.id}]-exp-blacklist-role`);
        for(const roleID of roleBl) {
            const role = message.guild.roles.cache.get(roleID);
            if(!role) break;
            if(message.member.roles.cache.has(role.id)) return;
        }

        const cooldown = await this.client.redis.hget(`guild[${message.guild.id}]-exp-modifiers`, 'cooldown');
        const expMod = await this.client.redis.hget(`guild[${message.guild.id}]-exp-modifiers`, 'exp-modifier'); 

        // cooldown
        const cooldownAmount = !cooldown ? 15000 : cooldown;
        const cooldowns = new Collection();

        if(!cooldowns.has(message.author.id))
                cooldowns.set(message.author.id, new Collection());
        const now = Date.now();
        const userCooldown = cooldowns.get(message.author.id);

        if(cooldowns.has(message.author.id)) {
            const expiration = userCooldown.get(message.author.id) + cooldownAmount;
            if(now < expiration) return;
        }
        userCooldown.set(message.author.id, now);

        setTimeout(() => userCooldown.delete(message.author.id), cooldownAmount);

        const expGen = !expMod ? 1 : parseInt(expMod, 10) + Math.floor(Math.random() * (8 - 5) + 5);
        const exp = await this.client.redis.zincr(`guild[${message.guild.id}]-exp`, expGen, `${message.author.id}`);

        let level = await this.client.redis.zscore(`guild[${message.guild.id}]-exp-level`, `${message.author.id}`);;
        if(!level) 
            level = await this.client.redis.zadd(`guild[${message.guild.id}]-exp-level`, 0, `${message.author.id}`);

        if((level == 0 && exp > 100) || (level != 0 && exp >= level * 150)) {
            const currentLevel = await this.client.redis.zincr(`guild[${message.guild.id}]-exp-level`, 1, `${message.author.id}`);
            await this.client.redis.zadd(`guild[${message.guild.id}]-exp`, 0, `${message.author.id}`);

            let roles = [];

            if(this.client.redis.hexists(`guild[${message.guild.id}]-levelRoles`, currentLevel)) {
                const levelRole = await this.client.redis.hget(`guild[${message.guild.id}]-levelRoles`, currentLevel);
                const role = message.guild.roles.cache.get(levelRole);
                if(role) {
                    await message.member.roles.add(role.id);
                    roles.push(role);
                }
            }

            if(this.client.redis.hexists(`guild[${message.guild.id}]-exp-reward`, `reward-${currentLevel}`)) {
                const levelRole = await this.client.redis.hget(`guild[${message.guild.id}]-exp-reward`, `reward-${currentLevel}`);
                const role = message.guild.roles.cache.get(levelRole);
                if(role) {
                    await message.member.roles.add(role.id);
                    roles.push(role);
                }
            }

            const replace = await this.client.redis.get(`guild[${message.guild.id}]-exp-replace`);
            if(replace === 'on') {
                for(let i = 1; i < currentLevel; i++) {
                    const field = await this.client.redis.hget(`guild[${message.guild.id}]-levelRoles`, i);
                    const current = await this.client.redis.hget(`guild[${message.guild.id}]-levelRoles`, currentLevel);
                    const role = message.guild.roles.cache.get(field);
                    if(!role || !field || !current) break;
                    await message.member.roles.remove(role);
                }
            }

            const msgState = await this.client.redis.get(`guild[${message.guild.id}]-exp-msg`);
            if(msgState === 'on') {
                const rank = await this.client.redis.zrank(`guild[${message.guild.id}]-exp-level`, `${message.author.id}`);
                message.reply(this.client.util.embed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`You are now level **${currentLevel}** ${roles.length ? `You have gained the following role(s) ${roles.join(',')}` : ''}`)
                .setFooter(`Server Rank #${rank + 1}`)
                .setColor(message.member.displayHexColor));
            }
        }
    }
}