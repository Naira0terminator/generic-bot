const { MessageEmbed } = require('discord.js');
const hastebin = require('hastebin');
const db = require('./redis.js');
const qdb = require('quick.db');
const { promisify } = require('util');
const ms = require('ms');

module.exports = class BanAction {
    constructor(action, user, message, reason = null) {
        this.action = action;
        this.target = user;
        this.message = message;
        this.reason = reason;
    }

    log() {
        this.createEmbed(this.action);
    }

    async createEmbed(action) {

        const channelID = qdb.get(`guild[${this.message.guild.id}].logChannels.mod`);
        if(!channelID) return;

        const channel = this.message.guild.channels.cache.get(channelID);
        if(!channel) return;

        let actionStrings = {
            ban: 'Banned 🔨',
            muted: 'Muted 🔇',
            unmuted: 'Unmuted 🔊',
            kick: 'Kicked 👢',
            unbanned: 'Unbanned 🔓',
            warn: 'Warned ⚠',
        };

        let actionColor = {
            ban: 'RED',
            muted: 'RED',
            unmuted: 'GREEN',
            kick: 'YELLOW',
            unbanned: 'YELLOW'
        }

        let color;

        switch(action) {
            case 'ban':
                action = actionStrings.ban;
                color = actionColor.ban;
            break;
            case 'muted':
                action = actionStrings.muted;
                color = actionColor.muted;
            break;
            case 'unmuted':
                action = actionStrings.unmuted;
                color = actionColor.unmuted;
            break;
            case 'unbanned':
                action = actionStrings.unbanned;
                color = actionColor.unbanned;
            break;
            case 'kick':
                action = actionStrings.kick;
                color = actionColor.kick;
            break;
            case 'warn':
                action = actionStrings.warn;
                color = actionColor.kick;
            break;
        }

        let user = this.target.user || this.target;
        let auditLogs = await qdb.get(`${this.message.guild.id}-Lastban`);
        let unbanData = await qdb.get(`${this.message.guild.id}-lastUnban`);

        const getMember = await this.message.guild.members.cache.get(user.id);

        // a very horrible way to resolve user information.
        const resolve = type => {
            switch(type) {
                case 'tag':
                    if(this.action === 'ban' && !getMember)
                        return auditLogs.targetTag;
                    else if(this.action === 'unbanned')
                        return unbanData.tag;
                    else 
                        return user.tag;
                case 'avatar':
                    if(this.action === 'ban' && !getMember)
                        return auditLogs.targetAvatar;
                    else if(this.action === 'unbanned')
                        return unbanData.avatar;
                    else 
                        return user.displayAvatarURL();
                case 'id':
                    if(this.action === 'ban' && !getMember)
                        return auditLogs.targetID;
                    else if(this.action === 'unbanned')
                        return unbanData.id;
                    else 
                        return user.id;
            }
        }

        const embed = new MessageEmbed()
        .setAuthor(`${resolve('tag')} ${action}`, resolve('avatar'))
        .setDescription(`[Logs](${await this.webLog()}) | [Message](https://discordapp.com/channels/${this.message.guild.id}/${this.message.channel.id}/${this.message.id})`)
        .addField('Moderator', this.message.author, true)
        .setFooter(`Target ID (${resolve('id')})`)
        .setTimestamp()
        .setColor(color);

        if(this.reason !== null && this.action !== 'warn') embed.addField('Reason', this.reason, false);

        if(this.action === 'muted') {
            const duration = await qdb.get(`user[${user.id}].moderation.muteData`);
            embed.addField('Duration', `${ms(duration.duration, {long: true})}`, true);
        }

        if(this.action === 'warn') {
            embed.addField('Warning', this.reason);
        }

        await channel.send(embed);
        
    }

    async webLog() {
        const getAsync = promisify(db.lrange).bind(db);
        const data = await getAsync(`messages-${this.message.channel.id}`, 0 , -1);
        const url = await hastebin.createPaste(data.join(' '), {
            raw: false,
            contentType: 'text/plain',
            server: 'https://haste.unbelievaboat.com/'
        });

        return url + '.txt';
    }

}