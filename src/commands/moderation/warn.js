const { Command } = require('discord-akairo');

module.exports = class warnCmd extends Command {
    constructor() {
        super('warn', {
            aliases: ['warn', 'warm', 'warns'],
            channel: 'guild',
            description: {
                content: 'warns the provided member',
                usage: '<member> <warning>',
                examples: ['@gaylord6969 dont spam >:C'],
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'warning',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'get',
                    match: 'flag',
                    flag: '-get',
                },
                {
                    id: 'del',
                    match: 'flag',
                    flag: '-del',
                },
            ],
        });
    }
    async exec(message, { member, warning, get, del }) {

        const warnPerm = await this.client.qdb.get(`guild[${message.guild.id}].perms.warn`);
        const canWarn = message.guild.roles.cache.get(warnPerm);

        if(!canWarn) return message.reply('no Perms have been set up with this command please use the **set-perms** command!');
        if(!message.member.roles.cache.has(canWarn.id)) return message.reply('you do not have permission to use the warn command!');

        if(get && member) {
            const warns = await this.client.qdb.get(`user[${member.user.id}].moderation.warns`);
            if(!warns) return message.reply('that member does not have any warnings!');

            return message.channel.send(this.client.util.embed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(warns.warnings.map(warn => `❃ - ${warn} - [Logs](${warns.log})`))
            .setColor('YELLOW')
            .setFooter(`Total warnings: ${warns.count}`));
        }

        if(del && member) {
            await this.client.qdb.delete(`user[${member.user.id}].moderation.warns`);

            return message.reply('that members warnings have been deleted!');
        }

        if(!member || !warning || member.user.bot) return message.reply('you must provide a valid member and warning!');

        if(member.user.id === message.author.id) return message.reply("Warning you're too cute");
        if(message.guild.owner.id !== message.member.id && member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) 
            return message.reply('You cannnot warn members that have roles then you!');

        try {
            member.send(this.client.util.embed()
            .setTitle(`You have been warned in ${message.guild.name} | ⚠`)
            .setDescription(`**Warning**: ${warning}`)
            .setColor('YELLOW')
            .setTimestamp());

            message.channel.send(`**${member.user.tag}** Has been warned! | ⚠`);
        } catch(err) {
            return message.reply(`could not warn **${member.user.tag}** | \`${err}\``);
        }

        //const logger = new this.client.modLog('warn', member, message, warning);
        //const url = await logger.webLog();

        if(!this.client.qdb.has(`user[${member.user.id}].moderation.warns`)) {
            this.client.qdb.set(`user[${member.user.id}].moderation.warns`, {
                warnings: [warning],
                count: 1,
                log: 'url',
            });
        }
        else {
            this.client.qdb.push(`user[${member.user.id}].moderation.warns.warnings`, warning);
            this.client.qdb.set(`user[${member.user.id}].moderation.warns.log`, 'url')
            this.client.qdb.add(`user[${member.user.id}].moderation.warns.count`, 1);
        }
        
        const logChannel = await this.client.qdb.get(`guild[${message.guild.id}].logChannels.mod`);
        const channel = await message.guild.channels.cache.get(logChannel);

        if(logChannel && channel) {
            const logger = await new this.client.modLog('warn', member, message, warning);
            logger.log();
        }
    }
}