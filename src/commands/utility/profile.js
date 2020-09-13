const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class profileCmd extends Command {
    constructor() {
        super('cats', {
            aliases: ['cats', 'puthy'],
            cooldown: 8000,
            channel: 'guild',
            description: 'shows your profile',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: message => message.member,
                },
                {
                    id: 'lb',
                    match: 'flag',
                    flag: 'lb',
                }
            ],
        });
    }
    async exec(message, { member, lb }) {

        if(lb) {

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
                    await msg.edit(createEmbed(start, end));
                }
                if(r.emoji.name === '⬅️') {
                    item -= 10;
                    end -= 10;
                    await msg.edit(createEmbed(start, end));
                }
                r.users.remove(message.author.id);
            });
    
            collector.on('end', async () => {
                await msg.reactions.removeAll();
                await msg.edit(`message is now inactive!\n${createEmbed(start, end)}`);
            });
    
            async function createEmbed(start, end) {
                const data = await client.redis.zrange(`guild[${message.guild.id}]-catch`, start, end);
                const rank = await client.redis.zrank(`guild[${message.guild.id}]-catch`, `${message.author.id}`);
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
                .setTitle('Catch Leaderboard')
                .setDescription(format
                    .filter(data => message.guild.members.cache.has(data.id))
                    .map((data, position) => {
                    const member = message.guild.members.cache.get(data.id);
                    return `\`[${position + 1}]\` | ${member.user.tag} - ${data.score}`;
                }))
                .setFooter(`You are #${rank + 1}`)
                .setColor('RANDOM');
            }

            return;
        }

        const data = await this.client.redis.zscore(`guild[${message.guild.id}]-catch`, `${member.id}`);
        const rank = await this.client.redis.zrank(`guild[${message.guild.id}]-catch`, `${member.id}`);

        message.channel.send(this.client.util.embed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setColor(member.displayHexColor === '#000000' ? 'RANDOM' : member.displayHexColor)
        .setDescription(stripIndents`
        **Cats** ${!data ? 0 : data} | **Rank** ${!data ? 'No rank' : `#${rank + 1}`}`));
    }
}