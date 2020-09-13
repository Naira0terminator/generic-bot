const { Command } = require('discord-akairo');
const rp = require('request-promise');
const $ = require('cheerio');

module.exports = class topicCmd extends Command {
    constructor() {
        super("topic", {
            aliases: ['topic'],
            cooldown: 8000,
            lock: "channel",
            channel: 'guild',
            description: 'Returns a random conversation topic from [Conversation starters](https://www.conversationstarters.com/generator.php)'
        });
    }
    async exec(message) {

        rp('https://www.conversationstarters.com/generator.php')
            .then(html => {
                message.channel.send($('#random', html).text());
            })
            .catch(() => message.channel.send("Could not get topic!"));
    }
}