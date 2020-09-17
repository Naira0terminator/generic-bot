const { Command } = require('discord-akairo');

module.exports = class FuckCommand extends Command {
    constructor() {
      super('fuck', {
        aliases: ['fuck'],
        channel: 'guild',
        cooldown: 8000,
        description: 'a command to hold someones hand but i hope its not premarital (custom command issued by robbie)',
        args: [
          {
            id: 'member',
            type: 'member',
            default: message => message.member,
          },
        ],
      });
    }
    exec(message, { member }) {

      let response = `**${message.author.username}** holds hands with **${member.user.username}**`;
        
      if(!member || member.id === message.author.id) response = `**${message.author.username}** is lonely`;
      
      message.util.send(this.client.util.embed()
      .setDescription(response)
      .setFooter('command issued by robbie')
      .setColor("RANDOM"));
  }
}
      