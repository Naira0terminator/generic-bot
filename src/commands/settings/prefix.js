const { Command, Argument } = require('discord-akairo');

module.exports = class prefixCmd extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            lock: 'guild',
            cooldown: 60000,
            description: {
                content: 'sets the prefix for the server',
                usage: '<NewPrefix>'
            },
            args: [
                {
                    id: 'set',
                    type: Argument.validate('string', (m, p, str) => str.length < 6)
                }
            ]
        });
    }
    async exec(message, { set }) {

        let prefix = this.client.config.prefix;

        if(this.client.qdb.has(`guild[${message.guild.id}].prefix`)) prefix = this.client.qdb.get(`guild[${message.guild.id}].prefix`);
        if(!set) return message.reply(`my current prefix is \`${prefix}\``);

        const setPrefix = await this.client.qdb.set(`guild[${message.guild.id}].prefix`, set);

        return message.channel.send(`my prefix has been changed from \`${prefix}\` to \`${Object.values(setPrefix)}\``);
    }
}