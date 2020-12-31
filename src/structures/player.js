class Dispatcher extends Map {
    constructor(player, client) {
        this.player = player;
        this.client = client;
        this.current = null;

        this.player.on('end', () => {
            if(this.current === null) 
                this.player.disconnect(true);
        });

        this.player.on('error', err => {
            console.log(err);
            this.player.disconnect(true);
        });
    }

    play() {
        
    }


}