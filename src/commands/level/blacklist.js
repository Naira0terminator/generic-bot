const { Command, Argument } = require('discord-akairo');
const { EMSGSIZE } = require('constants');

module.exports = class LBlacklistCmd extends Command {
    constructor() {
        super('lblacklist', {
            aliases: ['level-blacklist', 'lblacklist', 'lbl'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 8000,
            channel: 'guild',
            args: [
                {
                    id: 'type',
                    type: Argument.compose('lowercase'),
                },
                {
                    id: 'object',
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all'
                }
            ],
        });
    }
    async exec(message, { type, object, all }) {

        if(all) {
            const channelbl = await this.client.redis.smembers(`guild[${message.guild.id}]-exp-blacklist-channel`);
            const rolebl = await this.client.redis.smembers(`guild[${message.guild.id}]-exp-blacklist-role`);
            if(!channelbl && !rolebl) return message.reply('there are no blacklists for this server!');

            let response = '';

            if(channelbl.length) response += `**Channel**\n${channelbl
            .filter(channel => message.guild.channels.cache.has(channel))
            .map(channel => {
                const getChannel = message.guild.channels.cache.get(channel);
                return `${getChannel}`;
            })}`;

            if(rolebl.length) response += `\n**Role**\n${rolebl
            .filter(role => message.guild.roles.cache.has(role))
            .map(role => {
                const getRole = message.guild.roles.cache.get(role);
                return `${getRole}`;
            })}`;

            return message.channel.send(this.client.util.embed()
            .setTitle('Level blacklists')
            .setColor('RANDOM')
            .setDescription(response));
        }

        if(type === 'channel') {
            const channel = message.guild.channels.cache.get(object) || message.mentions.channels.first();
            if(await this.client.redis.sismember(`guild[${message.guild.id}]-exp-blacklist-channel`, channel.id)) {
                await this.client.redis.srem(`guild[${message.guild.id}]-exp-blacklist-channel`, channel.id);
                return message.channel.send(`**${channel.name}** Has been removed from the blacklist!`)
            }
            await this.client.redis.sadd(`guild[${message.guild.id}]-exp-blacklist-channel`, channel.id);
            return message.channel.send(`**${channel.name}** Has been blacklisted from the Leveling system!`);
        }

        else if(type === 'role') {
            const role = message.guild.roles.cache.get(object) || message.mentions.roles.first();
            if(await this.client.redis.sismember(`guild[${message.guild.id}]-exp-blacklist-role`, role.id)) {
                await this.client.redis.srem(`guild[${message.guild.id}]-exp-blacklist-role`, role.id);
                return message.channel.send(`**${role.name}** Has been removed from the blacklist!`)
            }
            await this.client.redis.sadd(`guild[${message.guild.id}]-exp-blacklist-role`, role.id);
            return message.channel.send(`Members with the **${role.name}** role will no longer earn exp!`);
        }

        else message.channel.send('That is not a valid blacklist type!');
    }
}