const { Listener } = require('discord-akairo');

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

        console.log(`$ | initialized in ${(end[0]* 1000000000 + end[1]) / 1000000} MS`);

        await this.client.user.setActivity('intitalizing...');
        let activities = ['BOOST DEVILS FOR SUCC!!', 'you\'re all cutie pies', `serving ${this.client.users.cache.size} Users!`], i=0
        setInterval(() => this.client.user.setActivity(`${this.client.config.prefix}Help | ${activities[i++ % activities.length]}`), 15000);

    }
}