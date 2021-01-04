const { Listener } = require('discord-akairo');
const spawn = require('child_process').spawn
const child_process = require('child_process');
const MusicPlayer = require('./../../structures/musicPlayer');
const { Manager } = require('lavaclient');


module.exports = class readyEvent extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }
    async exec() {

        const start = process.hrtime();

        console.log(`$ | ${this.client.user.username} is online!`);

        await this.client.commandHandler.loadAll();
        console.log(`$ | Loaded ${this.client.commandHandler.modules.size} commands`);
        await this.client.listenerHandler.loadAll(this.client.listenerHandler.directory, path => !path.includes('ready.js'));
        console.log(`$ | loaded ${this.client.listenerHandler.modules.size} Listeners`);

        const end = process.hrtime(start);

        console.log(`$ | initialized Commands & Listeners in ${(end[0]* 1000000000 + end[1]) / 1000000} MS`);

        await this.client.user.setActivity('intitalizing...');
        let activities = ['BOOST DEVILS FOR SUCC!!', 'you\'re all cutie pies', `serving ${this.client.users.cache.size} Users!`], i=0
        setInterval(() => this.client.user.setActivity(`${this.client.config.prefix}Help | ${activities[i++ % activities.length]}`), 15000);
       
        // const ls = spawn('C:\\Users\\Arian\\Documents\\bots\\little devil\\javalink\\run.bat');
        const child = child_process.exec('java -jar C:\\Users\\Arian\\Documents\\bots\\little devil\\javalink\\Lavalink.jar');
        console.log('$ | lavalink server started!')
        //ls.once('error', err => console.log(`There was an error starting lavalink server ${err.stack}`));
        child.on('error', err => console.log(`There was an error starting lavalink server ${err.stack}`));

        // this.client.player.musicClient.addNode({
        //     auth: 'mypassword',
        //     host: '0.0.0.0',
        //     name: 'PlayerNode',
        //     port: 6090
        // });
        
        // this.client.player.initEvents();

        const nodes = [{
            id: 'main node',
            host: 'localhost',
            port: 6090,
            password: 'mypassword',
        }];
        
        const client = this.client;
        this.client.manager = new Manager(nodes, {
            shards: 1,
            send(id, data) {
                const guild = client.guilds.cache.get(id);
                if(guild) guild.shard.send(data);
                return;
            }
        });

        this.client.manager.init(this.client.user.id);

        this.client.manager.on("socketError", ({ id }, error) => console.error(`${id} ran into an error`, error));
        this.client.manager.on("socketReady", (node) => console.log(`$ | Node: ${node.id} connected`));

        this.client.ws.on("VOICE_STATE_UPDATE", (upd) => this.client.manager.stateUpdate(upd));
        this.client.ws.on("VOICE_SERVER_UPDATE", (upd) => this.client.manager.serverUpdate(upd));
    }
}