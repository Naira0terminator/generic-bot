const { Command } = require('discord-akairo');
const request = require('node-superfetch');
const moment = require('moment');
const ms = require('ms');

module.exports = class youtubeCmd extends Command {
    constructor() {
        super('youtube', {
            aliases: ['youtube', 'yt'],
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            cooldown: 10000,
            description: {
                content: 'searches for a youtube video using googles search api',
                usage: '<search terms>'
            },
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message, { query }) {

        if(!query) return message.reply('you must provide and argument to search for a video!');

        try {
            const { body } = await request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({
                part:'snippet',
                type: 'video',
                maxResults: 25,
                q: query,
                key: this.client.config.youtubeKey
            });

            if(!body.items.length) return message.reply('i could not find any results');

            let item = 0;
            let client = this.client;

            const msg = await message.channel.send(constructEmbed(item));
            await msg.react('⬅️');
            await msg.react('➡️');

            const collector = await msg.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60000});

            collector.on('collect', async r => {
                if(r.emoji.name === '➡️') {
                    item++
                    await msg.edit(constructEmbed(item));
                }
                if(r.emoji.name === '⬅️') {
                    item--
                    await msg.edit(constructEmbed(item));
                }
                r.users.remove(message.author.id);
            });

            collector.on('end', async () => {
                await msg.reactions.removeAll();
                await msg.edit(`message is now inactive!\n${constructEmbed(item)}`);
            });

            function constructEmbed(item) {
                const data = body.items[item];
                /*const embed = client.util.embed()
                .setTitle(data.snippet.title)
                .setURL(`https://www.youtube.com/watch?v=${data.id.videoId})`)
                .setImage(data.snippet.thumbnails.high.url)
                .setFooter(`Published At: ${moment.utc(data.snippet.publishedAt).format('dddd, MMMM Do YYYY')}`)
                .setColor('#FF0000')*/
                const video = `https://www.youtube.com/watch?v=${data.id.videoId}`
                return video;
            }
                
        } catch(err) {
            console.log(err);
            message.reply('there was an error searching for that video!');
        }
    }
}