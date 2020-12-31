const dispatcher = require('./dispatcher');

module.exports = class Queue extends Map {
    constructor(client, iter) {
        super(iter);
        this.client = client;
    }

    async play(message, track, node) {

        if(!this.has(message.guild.id)) {

            const player = await node.joinVoiceChannel({
                guildID: message.guild.id,
                voiceChannelID: message.channel.id
            });

            const dispatcher = new Dispatcher(this.client, player, message.channel);
            dispatcher.queue.push(track);
            
            this.set(message.guild.id, dispatcher);


            return dispatcher;
        }

        this.get(message.guild.id).queue.push(track);
        return null;
    }
}