const { Command } = require('discord-akairo');

module.exports = class zuccCommand extends Command {
  constructor() {
      super('zucc', {
      aliases: ['zucc'],
      category: 'custom command for boosters',
      channel: 'guild',
      cooldown: 8000,
      description: 'Z U C C (custom command issued by lucifer morningstar)',
      args: [
        {
          id: 'member',
          type: 'member',
        },
      ],
      
      });
  }
  exec(message, { member }) {
    
    let response = `**${message.author.username}** *zuccs the life out of* **${member.user.username}**`;
    
    if(!member || member.id === message.author.id) response = `**${message.author.username}** zuccs themself to sleep`
    
    message.util.send(this.client.util.embed()
    .setDescription(`**${message.author.username}** *zuccs the life out of* **${member.user.username}**`)
    .setFooter('command issued by Lucifer')
    .setColor("RANDOM"));
  }
}
      