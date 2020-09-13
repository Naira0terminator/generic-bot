const { Command } = require('discord-akairo');
const { promisify } = require('util');
const { stripIndents } = require('common-tags');

module.exports = class muteSettings extends Command {
    constructor() {
        super('muteset', {
            aliases: ['mute-setup', 'mute-set'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            lock: 'guild',
            cooldown: 60000,
            description: {
                content: 'sets up the mute settings for the server.',
                usage: '**Using -remove will make it so that when a user is muted the given roles you provided in the command args will be removed from them\n-role MuteRole\n-remove role1 role2 role3',
            },
            args: [
                {
                    id: 'data',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'muteRole',
                    match: 'flag',
                    flag: '-role'
                }, 
                {
                    id: 'remove',
                    match: 'flag',
                    flag: '-remove',
                },
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset',
                }
            ],
        });
    }
    async exec(message, { data, muteRole, remove, reset}) {
        //
        if(!(muteRole || remove || reset)) {
            const prefix = await this.client.settings.get(message.guild.id) || this.client.config.prefix;
            return message.channel.send(this.client.util.embed()
                .setTitle('use the following arguments to setup the mute-settings')
                .setDescription(`
                \`${prefix}${this.aliases[0]} -role <roleID/roleMention>\` | sets the servers mute role.\n
                \`${prefix}${this.aliases[0]} -remove <one or more roles>\`| when the member is muted the bot will remove the provided roles from them and give it back once they are unmuted.\n
                \`${prefix}${this.aliases[0]} -reset\` | this will reset all of the mute related settings for this server!\n`)
                .setColor('RANDOM')
               );
        }

        if(muteRole) {

            if(!data) return message.reply('you must provide a valid role (id/mention/name)');
            const rFind = message.guild.roles.cache.find(r => r.name.toLowerCase() === data.toLowerCase()) || message.guild.roles.cache.get(data) || message.mentions.roles.first();
            if(!rFind) return message.reply('that is an invalid role!');

            this.client.qdb.set(`muteRole[${message.guild.id}]`, rFind.id);
            message.guild.channels.cache.each(channel => channel.updateOverwrite(rFind, { SEND_MESSAGES: false}));
            return message.channel.send(`Mute role has been set to **${rFind.name}**`);
        }
        
        if(remove) {

            if(!data) return message.reply('you must provide one or more roles. (id or mention)');

            let mentions = false;
            if(message.mentions.roles.size) {
                mentions = true;
                message.mentions.roles.forEach(async role => {
                    if(!this.client.qdb.has(`muteRemove[${message.guild.id}]`))
                        this.client.qdb.set(`muteRemove[${message.guild.id}]`, [role.id]);
                    else
                        this.client.qdb.push(`muteRemove[${message.guild.id}]`, `${role.id}`);
                });
            }

            if(!mentions) {

                const roleArray = data.split(/ +/g);
                for (let role of roleArray) {
                    const getRole = message.guild.roles.cache.get(role);
                    if(!getRole) return message.reply('one or more of the provided roles is not valid!');

                    if(!this.client.qdb.has(`muteRemove[${message.guild.id}]`))
                        this.client.qdb.set(`muteRemove[${message.guild.id}]`, [getRole.id]);
                    else
                        this.client.qdb.push(`muteRemove[${message.guild.id}]`, `${getRole.id}`);
                }
            }

            let removeRoles = await this.client.qdb.get(`muteRemove[${message.guild.id}]`);

            return message.channel.send(`the following roles will be removed from muted members: ${removeRoles.map(role => {
                const getRole = message.guild.roles.cache.get(role);
                return `**${getRole.name}**`;
            }).join(' ')}`);
        }

        if(reset) {
            await this.client.qdb.delete(`muteRemove[${message.guild.id}]`);
            await this.client.qdb.delete(`muteRole[${message.guild.id}]`);

            return message.reply('mute settings for this server have been reset!');
        }
    }
}