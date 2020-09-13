const { Command } = require('discord-akairo');

module.exports = class xplb extends Command {
    constructor() {
        super('xplb', {
            aliases: ['leaderboard', 'lb'],
            cooldown: 8000,
            channel: 'guild',
            description: 'Shows the top members in the exp leaderboard.'
        });
    }
    async exec(message) {

        let start = 0, end = 9;
        const client = this.client;

        const msg = await message.channel.send(await createEmbed(start, end));
        await msg.react('⬅️');
        await msg.react('➡️');

        const collector = msg.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60000});

        collector.on('collect', async r => {
            if(r.emoji.name === '➡️') {
                start += 10,
                end += 10,
                await msg.edit(createEmbed());
            }
            if(r.emoji.name === '⬅️') {
                start -= 10;
                end -= 10;
                await msg.edit(createEmbed());
            }
            r.users.remove(message.author.id);
        });

        collector.on('end', async () => {
            await msg.reactions.removeAll();
            await msg.edit(`message is now inactive!`);
        });

        async function createEmbed() {
            const data = await client.redis.zrange(`guild[${message.guild.id}]-exp-level`, start, end);
            const rank = await client.redis.zrank(`guild[${message.guild.id}]-exp-level`, `${message.author.id}`);
            const format = data.reduce((a, c, i) => {
                const idx = i / 2 | 0;
                if(i % 2) {
                    a[idx].score = c
                } else {
                    a[idx] = {id: c};
                }
                return a;
            }, []);

            return client.util.embed()
            .setTitle('Leaderboard')
            .setDescription(format
                .filter(data => message.guild.members.cache.has(data.id))
                .map((data, position) => {
                const member = message.guild.members.cache.get(data.id);
                return `\`[${position + 1}]\` | ${member.user.tag} - ${data.score}`;
            }))
            .setFooter(`You are #${rank + 1}`)
            .setColor('RANDOM');
        }
    }
}