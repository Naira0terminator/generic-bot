const { Command, Argument } = require('discord-akairo');

module.exports = class levelSettings extends Command {
    constructor() {
        super('lvlsettings', {
            aliases: ['level-settings', 'lset'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            args: [
                {
                    id: 'replace',
                    match: 'flag',
                    flag: 'replace'
                },
                {
                    id: 'msg',
                    match: 'flag',
                    flag: 'msg'
                },
                {
                    id: 'leaver',
                    match: 'flag',
                    flag: 'leaver'
                },
                {
                    id: 'cooldown',
                    match: 'flag',
                    flag: 'cooldown',
                },
                {
                    id: 'modifier',
                    match: 'flag',
                    flag: 'modifier',
                },
                {
                    id: 'value',
                    type: Argument.compose('lowercase'),
                }
            ],
        });
    }
    async exec(message, { replace, msg, leaver, value, cooldown, modifier }) {

        // cooldown and exp modifier settings these are seperated caues they are set differently.
        const intValue = parseInt(value);
        if(cooldown) {
            if(isNaN(intValue)) return message.reply('given value is not a valid number!');
            await this.client.redis.hset(`guild[${message.guild.id}]-exp-modifiers`, 'cooldown', intValue * 1000);
            return message.channel.send(`members will now earn exp only once every **${intValue}** seconds`);
        }

        if(modifier) {
            if(isNaN(intValue) || intValue > 100 && intValue < 1) return message.reply('given value is not a valid number above 0 and under 100!');
            await this.client.redis.hset(`guild[${message.guild.id}]-exp-modifiers`, 'exp-modifier', intValue);
            return message.channel.send(`Members will now recieve +**${intValue}** exp`);
        }

        // main settings that are set with either on or off
        if(value && !(value === 'on' || value === 'off')) return message.reply('Invalid setting! try \`on\` or \`off\`');

        const state = value === 'on' ? 'Enabled' : 'Disabled';

        const handleSettings = async (action, response) => {
            await this.client.redis.set(`guild[${message.guild.id}]-exp-${action}`, value);
            message.channel.send(`${response} \`${state}\``);
        }

        if(replace) return handleSettings('replace', `Level role replacing:`);

        else if(msg) return handleSettings('msg', `Level up message:`);

        else if(leaver) return handleSettings('leaver', `Leaver EXP loss:`);

        else {
            const displayData = async data => {
                const state = await this.client.redis.get(`guild[${message.guild.id}]-exp-${data}`);
                return `${state === 'on' ? '`Enabled`' : '`Disabled`'}`;
            }
            
            const cooldown = await this.client.redis.hget(`guild[${message.guild.id}]-exp-modifiers`, 'cooldown');
            const expMod = await this.client.redis.hget(`guild[${message.guild.id}]-exp-modifiers`, 'exp-modifier');

            message.channel.send(this.client.util.embed()
            .setTitle('Level settings')
            .setDescription('Set data with <prefix>level-settings <type> on/off\n**Types** replace, leaver, msg')
            .addField('Level replacing', await displayData('replace'), true)
            .addField('Level up message', await displayData('msg'), true)
            .addField('Leaver EXP loss', await displayData('leaver'), true)
            .addField('Exp cooldown',`\`${!cooldown ? 'Default cooldown' : cooldown / 1000 + ' Seconds'}\``, true)
            .addField('Exp Modifier', `\`${!expMod ? 'No modifier set' :  '+' + expMod + ' EXP'}\``, true)
            .setColor('RANDOM'));
        }
    }
}