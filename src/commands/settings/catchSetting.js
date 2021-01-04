const { Command } = require('discord-akairo');

module.exports = class catchSettings extends Command {
    constructor() {
        super('catchsettings', {
            aliases: ['catch-setting', 'catch-set'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 60000,
            channel: 'guild',
            description: {
                content: 'set the catch settings for the server.\nby default the command will set the channel for the catch event to occure(only one channel per server)\n-toggle will toggle it on and off',
                usage: '<channel>\n-toggle\n-clear <member>'
            },
            args: [
                {
                    id: 'toggle',
                    match: 'flag',
                    flag: '-toggle',
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: '-clear',
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set',
                },
                {
                    id: 'arg',
                },
                {
                    id: 'value',
                }
            ],
        });
    }
    async exec(message, { toggle, clear, set, arg, value }) {

        if(toggle) {
            let data = await this.client.redis.get(`guild[${message.guild.id}]-catch-state`);
            if(!data) return message.reply('you must set a catch channel before you can toggle it on or off!');

            if(data === 'on') 
                data = await this.client.redis.set(`guild[${message.guild.id}]-catch-state`, 'off');
            if(data === 'off')
                data = await this.client.redis.set(`guild[${message.guild.id}]-catch-state`, 'on');
            else return message.util.reply("Invalid data set!");
            
            return message.util.reply(`catch has been set to: \`${data === 'off' ? 'Disabled' : 'Enabled'}\``);
        }

        if(set) {
            const member = message.guild.members.cache.get(arg) || message.mentions.members.first();
            await this.client.redis.zadd(`guild[${message.guild.id}]-catch`, value, `${member.id}`);
            return message.channel.send(`**${member.user.username}**'s cats have been set to ${value}`);
        }

        if(clear) {
            const member = message.guild.members.cache.get(arg) || message.mentions.members.first();
            await this.client.redis.zrem(`guild[${message.guild.id}]-catch`, `${member.id}`);
            return message.reply(`**${member.user.username}**'s catch Data has been reset!`);
        }

        const ch = message.channel || message.guild.channels.cache.get(arg) || message.mentions.channels.first();
        if(!ch) return message.reply('you must provide a valid channel');

        await this.client.redis.set(`guild[${message.guild.id}]-catch-channel`, ch.id);
        await this.client.redis.set(`guild[${message.guild.id}]-catch-state`, 'on');

        message.channel.send(`The catch channel has been set to ${ch}`);
    }
}