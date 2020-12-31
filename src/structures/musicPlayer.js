const { Shoukaku } = require('shoukaku');
const Dispatcher = require('./dispatcher');

class MusicPlayer {
    constructor(client) {
        this.client = client
        this.musicClient = new Shoukaku(this.client, 
            [{ name: 'Localhost', host: 'localhost', port: 135, auth: 'bot' }],
            { moveOnDisconnect: true, resumable: true, resumableTimeout: 30, reconnectTries: 50, restTimeout: 10000 });
    }

    initEvents() {
        this.musicClient.on('ready', name => console.log(`$ | Music player has connected! Node: ${name}`));
        this.musicClient.on('error', (name, error) => console.log(`Player node ${name} had an error ${error.stack}`));
    }

    async play(message, track, node) {

        const { channel } = message.member.voice;

        const player = await node.joinVoiceChannel({
            guildID: message.guild.id,
            voiceChannelID: channel.id
        });

        const dispatcher = new Dispatcher(this.client, player, message.channel);
        this.client.queue.set('dispatcher', dispatcher);

        await player.playTrack(track);
    }


    get node() {
        return this.musicClient.getNode();
    }
}

module.exports = MusicPlayer;