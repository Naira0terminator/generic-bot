module.exports = class Dispatcher {
    constructor(client, player, channel) {
        this.player = player;
        this.client = client;
        this.channel = channel;
        this.queue = [];
        this.current = null;

        this.player.on('end', () => {
            this.queue.shift();
            if(!this.queue.length) return this.player.disconnect();

            this.player.playTrack(this.queue[0]);
        });

        this.player.on('error', error => {
            console.log(`Player had an error ${error.stack}`);
            this.player.disconnect();
        });
    }

    play() {
        this.current = this.queue.shift();
        this.player.playTrack(this.current);
    }
    
}