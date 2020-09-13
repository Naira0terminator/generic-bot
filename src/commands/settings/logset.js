const { Command, Argument } = require('discord-akairo');

module.exports = class logSetCmd extends Command {
    constructor() {
        super('logset', {
            aliases: ['log-set'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 20000,
            channel: 'guild',
            lock: 'guild',
            args: [
                {
                    id: 'type',
                    type: Argument.compose('lowercase'),
                },
                {
                    id: 'channel',
                    type: 'channel',
                },
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset',
                }
            ],
        });
    }
    async exec(message, { type, channel, reset }) {

        const isSet = type => {

            if(this.client.qdb.has(`guild[${message.guild.id}].logChannels.${type}`)) {
                this.client.qdb.delete(`guild[${message.guild.id}].logChannels.${type}`)
                return true;
            }

            else
                return false;
        }

        const setData = (type, channel) => {
            if(!channel) return message.reply('that is not a valid channel!');
            this.client.qdb.set(`guild[${message.guild.id}].logChannels.${type}`, channel.id);
            message.channel.send(this.client.util.embed()
            .setDescription(`**${type}** has been set to ${channel}`)
            .setColor('RANDOM')
            .setFooter('to reset this you can write the command again without providing a channel!'));
        }

        if(reset) {
            this.client.qdb.delete(`guild[${message.guild.id}].logChannels`);
            return message.reply('log channels for this server have been reset!');
        }

        if(!type) {
            const prefix = await this.client.settings.get(message.guild.id) || this.client.config.prefix;
            return message.channel.send(this.client.util.embed()
            .setTitle('setting perms')
            .setDescription(`to set a logging channel first provide the log type then the channel
            \n**Log types**: \`mod (moderation)\`
            \n**Example**: \`${prefix}${this.aliases[0]} mod #mychannel\`
            \n**Note**: To reset any single channel as long as its already set use the command without a channel. I.E \`${prefix}${this.aliases[0]} mod\``)
            .setColor('RANDOM')
            .setFooter('Make sure the provided channel is valid!')); 
        }

        switch(type) {
            case 'mod':
                if(isSet('mod')) return message.reply('i have reset that log channel');
                setData('mod', channel);
            break;
            default:
                message.channel.send('that is not a valid log type.')
            break;
        }
    }
}