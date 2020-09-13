const { Command } = require('discord-akairo');

module.exports = class activeCmd extends Command {
    constructor() {
        super('active', {
            aliases: ['active'],
            channel: 'guild',
            cooldown: 7200000,
            description: 'pings the active role or the vc role with. only usabel by members with the trusted role in devils.',
            args: [
                {
                    id: 'vc',
                    match: 'flag',
                    flag: 'vc',
                }
            ]
        });
    }
    async exec(message, { vc }) {

        if(!message.member.roles.cache.has('667117435396161596')) return message.reply('only trusted member can ping the active role!');

        let pingRole = message.guild.roles.cache.get('646422736129753088');
        
        if(vc) 
            pingRole = message.guild.roles.cache.get('646422735601532928');

        // logs channel
        const ch = message.guild.channels.cache.get('646768239384199168');
        
        await pingRole.setMentionable(true);
        await message.channel.send(`${pingRole} Time to be active!!!`);
        await pingRole.setMentionable(false);
        
        ch.send(this.client.util.embed()
        .setTitle("Active ping used!")
        .setDescription(`${message.member.user} Has used the \`Active\` Command in ${message.channel}`)
        .setColor('#b16ad8')
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp());
        
        message.delete();
    }
}