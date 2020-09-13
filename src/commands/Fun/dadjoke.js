const { Command } = require('discord-akairo');
const rp = require('request-promise');
const $ = require('cheerio');

module.exports = class dadjokeCmd extends Command {
    constructor() {
        super('dadjoke', {
            aliases: ['dadjoke', 'hahafunny'],
            description: 'get a random dad joke from [icanhazdadjoke](https://icanhazdadjoke.com/)',
            cooldown: 8000,
            lock: 'channel',
            channel: 'guild',
        });
    }
    async exec(message) {

        rp('https://icanhazdadjoke.com/')
            .then(html => {
                message.util.send($('.subtitle', html).text().slice(15));
            });
    }
}