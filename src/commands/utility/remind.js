const { Command } = require('discord-akairo');
const Ms = require('ms');
const wait = require('util').promisify(setTimeout);

module.exports = class reminderCmd extends Command {
    constructor() {
        super('reminder', {
            aliases: ['reminder', 'remindme', 'remind'],
            cooldown: 60000,
            description: {
                content: 'create a reminder so you never forget to be a wholesome cutie.',
                usage: '<reminder> in <time>',
                examples: ['Do something epic in 20 minutes'],
            },
            args: [
                {
                    id: 'reminder',
                    match: 'rest',
                }
            ]
        })
    }
    async exec(message, { reminder }) {

        if(!reminder) return message.reply('please provide a reminder and a time in the format of: <prefix>remindme buy groceries in 10 minutes');

        const reminderSplit = reminder.split(/(\bin\b)(?!.*\b\1\b)/);
        const time = reminderSplit[2].trim();
        if(!time.match(/^\d/)) return message.reply('you must provide a proper time!');
        const reminderMSG = reminderSplit[0];

        const embed = this.client.util.embed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`i set a reminder for you in ${Ms(Ms(time), {long: true})}`)
        .setColor('RANDOM')
        message.util.send(embed);

        await wait(Ms(time));

        const endEmbed = this.client.util.embed()
        .setTitle('Reminder!')
        .setDescription(reminderMSG)
        .setColor('RANDOM')
        try {
            await message.author.send(endEmbed)
        } catch(err) {
            endEmbed.setAuthor(message.author.username, message.author.displayAvatarURL())
            message.channel.send(`${message.author} i was unable to dm you so i sent it in the command channel instead!`, endEmbed);
        }
    }
}