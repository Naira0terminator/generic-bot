const { Command } = require('discord-akairo');
const os = require('os');
const { stripIndents } = require('common-tags');

module.exports = class botinfoCmd extends Command {
    constructor() {
        super('botinfo', {
            aliases: ['bot-info', 'info'],
            cooldown: 10000,
            description: 'Shows information on the bot like uptime and memory usage.'
        });
    }
    exec(message) {
        
        let totalSeconds = (this.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days === 0 ? "" : `${days} days,`} ${hours === 0 ? "" : `${hours} hours,`} ${minutes === 0 ? "" : `${minutes} minutes,`} ${seconds === 0 ? "" : `${seconds} seconds`}`;
        
        const infoembed = this.client.util.embed()
        .setAuthor(`${this.client.user.username}`)
        .setDescription(stripIndents
            `[Repository](https://github.com/Naira0terminator/generic-bot)
            
            **Uptime**: \`${uptime.trim()}\`\n
            **Commands**: \`${this.client.commandHandler.modules.size}\`\n
            **Library**: \`Discord.js\`\n
            **Heap memory usage**: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem()/1024/1024)} GB\`\n
            **Total servers**: \`${this.client.guilds.cache.size}\``)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setFooter('Created by Naira#2819')
        .setColor('RANDOM')
        message.util.send(infoembed)

    }
}
