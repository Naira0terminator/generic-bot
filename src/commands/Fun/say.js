const { Command } = require('discord-akairo');

module.exports = class sayCmd extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 's'],
            description: 'make the bot say anything. you can also make the message into an embed if you include \`-e\` in the message.',
            args: [
                {
                    id: 'sEmbed',
                    match: 'flag',
                    flag: '-e',
                },
                {
                    id: 'say',
                    match: 'rest'
                },
            ],
        });
    }
    exec(message, {sEmbed, say}) {
        
        message.delete();
        
        if(sEmbed) {
            const embed = this.client.util.embed()
            .setAuthor(`from ${message.author.username}`, message.author.displayAvatarURL())
            .setDescription(say)
            .setColor('RANDOM')
            return message.channel.send(embed);
        }

        if(say) return message.util.send(say);
            
    }
    
}
