const { Command } = require('discord-akairo');

module.exports = class HugCommand extends Command {
    constructor() {
      super('hug', {
        aliases: ['hug'],
        channel: 'guild',
        cooldown: 8000,
        description: 'a command to hug somebody (custom command issued by caleb)',
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

      let response = `**${message.author.username}** hugs **${member.user.username}**`;
        
      if(!member || member.id === message.author.id) response = `**${message.author.username}** needs a hug`;
      
      message.util.send(this.client.util.embed()
      .setDescription(response)
      .setFooter('command issued by caleb')
      .setColor("RANDOM"));
  }
}