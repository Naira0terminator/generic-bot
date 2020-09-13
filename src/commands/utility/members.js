const { Command } = require('discord-akairo');

module.exports = class memCmd extends Command {
    constructor() {
        super('member', {
            aliases: ['members', 'm'],
            channel: 'guild',
            description: 'Shows the message servers member count'
        });
    }
    exec(message) {

       const humans = message.guild.members.cache.filter(member => !member.user.bot).size;
       const totalHumans = message.guild.members.cache.size
       const bots = message.guild.members.cache.filter(member => member.user.bot).size
      
       message.util.send(this.client.util.embed()
       .addField('Total members: ', totalHumans, true)
       .addField('Humans: ', humans, true)
       .addField('bots: ', bots , true)
       .setColor('#b16ad8'));
        
    }
}
