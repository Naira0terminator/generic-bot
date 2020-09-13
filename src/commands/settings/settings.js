const { Command } = require('discord-akairo');

module.exports = class settingsCmd extends Command {
    constructor() {
        super('settings', {
            aliases: ['settings'],
            channel: 'guild',
            cooldown: 60000,
            description: 'shows the current server settings!',
        });
    }
    async exec(message) {

        // indexes the mute settings so they are easy to modify and use
        let muteSettings = {
            muteRole: this.client.qdb.has(`muteRole[${message.guild.id}]`) ? this.client.qdb.get(`muteRole[${message.guild.id}]`) : 'No mute role set.',
            removeRoles: this.client.qdb.has(`muteRemove[${message.guild.id}]`) ? this.client.qdb.get(`muteRemove[${message.guild.id}]`)
            .map(role => {
                const getRole = message.guild.roles.cache.get(role);
                return getRole;
            }).join(' ') : 'No roles have been set.'
        }

        // gets the mute role from the guild and checks if its still a valid role.
        if(muteSettings.muteRole.match(/\d+/)) {
            muteSettings.muteRole = message.guild.roles.cache.get(muteSettings.muteRole);
            if(!muteSettings.muteRole) muteSettings.muteRole = 'Invalid or deleted role - please set this to a valid role!';
        }

        const logChannel = type => {
            let returnData = this.client.qdb.has(`guild[${message.guild.id}].logChannels.${type}`) ? this.client.qdb.get(`guild[${message.guild.id}].logChannels.${type}`) : 'No channel set'

            if(returnData.match(/\d+/)) {
                const channel = message.guild.channels.cache.get(returnData);

                if(!channel) returnData = 'Invalid or deleted channel - please set it to a valid channel';

                else
                    returnData = channel;
            }

            return returnData;
        }

        const catchChannel = await this.client.redis.get(`guild[${message.guild.id}]-catch-channel`);
        const catchState = await this.client.redis.get(`guild[${message.guild.id}]-catch-state`);

        return message.channel.send(this.client.util.embed()
        .setAuthor(`Server settings for ${message.guild.name}`, message.guild.iconURL())
        .setDescription('to change or add any server settings please check the help command and use the appropriate command!')
        .addField('Mute settings:', `\`Mute Role:\` ${muteSettings.muteRole}\n\`Roles to remove on mute:\` ${muteSettings.removeRoles}`, true)
        .addField('Prefix:', `\`${this.client.qdb.get(`guild[${message.guild.id}].prefix`)}\``, true)
        .addField('Logging channels:', 
        `\`Moderation\` ${logChannel('mod')}`, true)
        .addField('Catch settings:', 
        `\`Channel\` ${this.client.resolve('channel', catchChannel, message.guild) || 'Not set.'}
        \`State\` ${catchState == 'on' ? 'Enabled' : 'Disabled'}`)
        .setColor('RANDOM'));
    }
}