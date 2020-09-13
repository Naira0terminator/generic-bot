const { Command } = require('discord-akairo');

module.exports = class giveCmd extends Command {
    constructor() {
        super('cookie', {
            aliases: ['cookie'],
            channel: 'guild',
            cooldown: 8000,
            description: 'give someone a cookie. mmm useless digital bits',
            args: [{
                id: 'member',
                type: 'member',
                match: 'rest',
                prompt: {
                    start: 'who would you like to give cookies to?',
                    retry: 'that is not a valid member!',
                    retries: 1,
                    optional: true,
                },
            }],
        });
    }
    exec(message , { member }) {

        if(member.id === message.author.id) return message.reply('you cannot give yourself cookies!');
        if(member.user.bot) return message.reply('bots dont need cookies!');

        if(!this.client.qdb.has(`user[${member.user.id}].cookies`)) {
            this.client.qdb.set(`user[${member.user.id}].cookies`, 1);
        }

        if(this.client.qdb.has(`user[${member.user.id}].cookies`)) {
            this.client.qdb.add(`user[${member.user.id}].cookies`, 1);
        }

        const embed = this.client.util.embed()
        .setDescription(`i gave **${member.user.username}** a cookie 🍪!`)
        .setColor('RANDOM')
        .setFooter(`${member.user.username}'s total cookies: ${this.client.qdb.get(`user[${member.user.id}].cookies`)}`)
        return message.util.send(embed)

    }
}
