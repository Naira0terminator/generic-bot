const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core-discord');
const request = require('node-superfetch');

module.exports = class playCmd extends Command {
    constructor() {
        super('play', {
            aliases: ['play', 'p'],
            channel: 'guild',
            cooldown: 5000,
            clientPermissions: ['CONNECT', 'SPEAK'],
            description: {
                content: 'plays any youtube video in voice chat. uses googles search api to give the most accurate results',
                usage: '<song name>',
            },
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest'
                },
            ],
        });
    }
    async exec(message, { query }) {

        const { channel } = message.member.voice;
        if(!query) return message.reply("You must provide a song for me to play!");
        if(!channel) return message.reply("You must be in a voice channel to play music!");

        const msg = await message.channel.send(this.client.util.embed()
        .setDescription("Searching...")
        .setColor("YELLOW"));

        const { body } = await request
        .get('https://www.googleapis.com/youtube/v3/search')
        .query({
            part: 'snippet',
            type: 'video',
            maxResults: 1,
            q: query,
            key: this.client.config.youtubeKey,
        });

        if(!body.items.length) return message.reply('i could not find any results');

        const data = body.items[0];
        const song = {
            title: data.snippet.title,
            videoChannel: data.snippet.channelTitle,
            thumbnail: data.snippet.thumbnails.high.url,
            url: `https://www.youtube.com/watch?v=${data.id.videoId}`,
        };
        const serverQueue = this.client.queue.get(message.guild.id);

        if(serverQueue) {
            if(serverQueue.songs.length >= 50) return message.reply('the queue limit has been reached!');
            serverQueue.songs.push(song);
            return msg.edit(`Added **${song.title}** to the server Queue!`);
        }

        const createQueue = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        this.client.queue.set(message.guild.id, createQueue);
        createQueue.songs.push(song);

        const play = async song => {

            const queue = this.client.queue.get(message.guild.id);

            if(!queue.songs.length) {
                channel.leave();
                return this.client.queue.delete(message.guild.id);
            }

            const dispatcher = queue.connection.play(await ytdl(song.url), 
            {
                highWaterMark: 1 << 25, 
                type: 'opus',
                filter: 'audioonly',
            }, {volume: false})
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', err => {
                console.log(err);
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .setVolumeLogarithmic(queue.volume / 5);

            await msg.edit(this.client.util.embed()
            .setAuthor("Added to queue", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQeql3Zd_XgQZ4KOoQwUWtawrWRqeQf1o7Mdw&usqp=CAU')
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.title}](${song.url})`)
            .setColor("GREEN"));

        };

        try {
            const connection = await channel.join();
            createQueue.connection = connection;
            play(createQueue.songs[0]);
        } catch(err) {
            console.log(`error occured while trying to join a voice channel in ${message.guild.name}, ${err}`);
            this.client.queue.delete(message.guild.id)
            await channel.leave();
            return message.reply('there was an error joining the voice channel. it has been logged.');
        }
    }
}

