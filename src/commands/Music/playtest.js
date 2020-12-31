const { Command } = require('discord-akairo');
const request = require('node-superfetch');
const moment = require('moment');

module.exports = class PlayCmd extends Command {
    constructor() {
        super('play', {
            aliases: ['play', 'p'],
            cooldown: 5000,
            lock: 'guild',
            channel: 'guild',
            clientPermissions: ['CONNECT', 'SPEAK'],
            description: {
                content: 'plays any youtube video in voice chat. uses googles search api to give the most accurate results',
                usage: '<song name>',
            },
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest',
                },
            ]
        });
    }
    async exec(message, { query }) {

        const { channel } = message.member.voice;
        if(!channel) return message.reply('you must be in a voice channel to play songs!');

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

        if(!body.items.length) 
        return await msg.edit(this.client.util.embed()
            .setDescription('Could not find any results!')
            .setColor("RED"));

        const data = body.items[0];
        const song = {
            title: data.snippet.title,
            thumbnail: data.snippet.thumbnails.high.url,
            url: `https://www.youtube.com/watch?v=${data.id.videoId}`,
            info: null,
            track: null,
        };

        const player = this.client.manager.create(message.guild.id);

        const search = await player.manager.search(song.url);
    
        if(!search || !search.tracks.length) {
            player.disconnect(true);
            return message.reply('no results found!');
        }   

        const { info, track } = search.tracks[0];

        song.info = info;
        song.track = track;

        const exitingQueue = this.client.queue.get(message.guild.id);

        if(exitingQueue) {
            if(exitingQueue.songs.length >= 100) return await msg.edit(this.client.util.embed()
            .setDescription('Queue limit has been reached!')
            .setColor("RED"));

            exitingQueue.songs.push(song);
            return await msg.edit(this.client.util.embed()
            .setAuthor("Added to queue", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQeql3Zd_XgQZ4KOoQwUWtawrWRqeQf1o7Mdw&usqp=CAU')
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.title}](${song.url})`)
            .setColor("GREEN")
            .setFooter(`Video duration: ${moment(info.length).format('mm:ss')}`));
        }

        const CreateQueue = {
            textChannel: message.channel,
            voiceChannel: channel,
            player: player,
            songs: [song],
            playing: true
        };

        this.client.queue.set(message.guild.id, CreateQueue);

        const play = async track => {
            
            const queue = this.client.queue.get(message.guild.id);

            player.connect(channel.id, {selfDeaf: true});
            await player.play(track);

            player.on('end', () => {
                console.log(`Songs: ${queue.songs}`);
                queue.songs.shift();
                queue.songs.length ? player.play(queue.songs[0].track) : player.disconnect(true) && this.client.queue.delete(message.guild.id);
            });

            await msg.edit(this.client.util.embed()
            .setAuthor("Added to queue", 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQeql3Zd_XgQZ4KOoQwUWtawrWRqeQf1o7Mdw&usqp=CAU')
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.title}](${song.url})`)
            .setColor("GREEN")
            .setFooter(`Video duration: ${moment(info.length).format('mm:ss')}`));
        }

        try {
            play(track);
        } catch(err) {
            console.log(err.stack)
            message.channel.send(`there was an error playing music ${err}`);
        }
    }
}