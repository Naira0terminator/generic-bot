const { Command } = require('discord-akairo');
const fetch = require('node-superfetch');

module.exports = class imgSearch extends Command {
    constructor() {
        super('img', {
            aliases: ['img-search', 'img'],
            channel: 'guild',
            lock: 'channel',
            cooldown: 8000,
            description: {
                content: 'does an image search with slides.',
                usage: '<search term>',
            },
            args: [
                {
                    id: 'search',
                    type: 'string',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message, { search }) {

        const { body } = await fetch
        .get('https://customsearch.googleapis.com/customsearch/v1')
        .query({
            q: search,
            num: 10,
            safe: 'active',
            searchType: 'image',
            key: this.client.config.googleKey,
            cx: '000606063932237113240:q-nv8rtizca',
        });

        let item = 0;
        let client = this.client;
        let forward = '➡️'
        let backward = '⬅️'

        const msg = await message.channel.send(constructEmbed(item));
        await msg.react(backward);
        await msg.react(forward);

        const collector = msg.createReactionCollector((r, u) => [forward, backward].includes(r.emoji.name) && u.id === message.author.id, {time: 60000});

        collector.on('collect', async r => {
            if(r.emoji.name === forward) {
                item++;
                await msg.edit(constructEmbed(item));
            }
            if(r.emoji.name === backward) {
                item--;
                await msg.edit(constructEmbed(item));
            }

            r.users.remove(message.author.id);
        });

        collector.on('end', async () => {
            await msg.reactions.removeAll();
            await msg.edit('message is now inactive!');
        });

        function constructEmbed(item) {
            const data = body.items[item];
            const embed = client.util.embed()
            .setTitle(data.title)
            .setDescription(`[Link](${data.link})`)
            .setImage(data.link)
            .setColor('RANDOM')
            return embed;
        }
    }
}