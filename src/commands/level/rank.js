const { Command } = require('discord-akairo');

module.exports = class rankCmd extends Command {
    constructor() {
        super('rank', {
            aliases: ['rank', 'level'],
            cooldown: 8000,
            channel: 'guild',
            description: 'shows your current level in the server.',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: message => message.member,
                }
            ]
        });
    }
    async exec(message, { member }) {

        const serverRank = await this.client.redis.zrank(`guild[${message.guild.id}]-exp-level`, `${member.id}`);
        const exp = await this.client.redis.zscore(`guild[${message.guild.id}]-exp`, `${member.id}`);

        const level = await this.client.redis.zscore(`guild[${message.guild.id}]-exp-level`, `${member.id}`);
        if(level <= 0) return message.reply('You are the provided member does not have a level! keep talking to earn exp');

        const precentage = exp / (150 * level);
        const progress = Math.round(10 * precentage);
        let bar = `${'■'.repeat(progress)}${'□'.repeat(10 - progress)}`
        
        message.channel.send(this.client.util.embed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .addField(`Level ${level}`, `[${bar}](https://www.youtube.com/watch?v=jXglHzoG_Zs) ${Math.round(precentage * 100)}% | \`${exp}/${level * 150}\``)
        .setFooter(`Rank #${serverRank + 1}`)
        .setColor(member.displayHexColor));
    }
}