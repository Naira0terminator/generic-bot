const { Command } = require('discord-akairo');

module.exports = class makePm extends Command {
    constructor() {
        super('pm', {
            aliases: ['pm', 'makepm'],
            clientPermissions: ['MANAGE_ROLES'],
            channelRestriction: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message, { member }) {

        let pmRole = '647399478965305374';

        if (!member.roles.has(pmRole)) {
            
        await member.roles.add(pmRole);
        
        message.channel.send(this.client.util.embed()
        .setDescription(`**${member.user.username}** is now a partnership manager!`)
        .setColor('RANDOM'))

        member.send(this.client.util.embed()
        .setDescription(`welcome to the partner team were glad too have you.\n\nwrite \`,ad\` for our server description.\n\n**Information**:\n\n💠We do not have a member requirement you can partner with servers of any size\n\n\💠 servers you are partering with must not be toxic and they must follow tos\n\n\💠 you are allowed to deny any partnership if they require you too rep or ping everyone or here\n\n\💠 you are also allowed to deny any partnership if a person is being very rude.\n\nif you have anymore questions feel free too dm <@341891209100394497>`)
        .setColor('RANDOM'));

        try {
            await member.setNickname(`${member.user.username} | DM to partner`);  
          } catch (err) {
              message.channel.send(`Their was an error changing **${member.user.username}**'s nickname!`);
              console.log(err);
          }
        }

        else {

            await member.roles.remove(pmRole)
            await member.setNickname(member.user.username);
            
            member.send(`You are no longer a partnership manager in ${message.guild.name}`);

        }
    }
    userPermissions(message) {
        return message.member.roles.cache.has('663625243470069773');
    }
}