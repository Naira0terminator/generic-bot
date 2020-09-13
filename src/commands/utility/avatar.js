const { Command } = require('discord-akairo');

module.exports = class avatarCmd extends Command {
    constructor() {
        super('avatar', {
            aliases: ['avatar', 'av', 'pfp', 'icon'],
            channel: 'guild',
            cooldown: 8000,
            description: {
                content: 'shows your or another members profile picture.',
                usage: '<Member>',
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    prompt: 
                    {
                        retry: "i cannot find that user try again",
                        retries: 1,
                        optional: true,
                    },
                    default: message => message.member,
                    
                }
            ],
        });
    }
    exec(message, { member }) {

        let url = member.user.displayAvatarURL({format: 'png', dynamic: true, size: 2048});

        const embed = this.client.util.embed()
        .setTitle(`${member.user.username}\'s Profile picture`)
        .setDescription(`[link](${url})`)
        .setImage(url)
        .setColor(member.displayHexColor)
        message.util.send(embed)  
        
        if(message.mentions.users.size) 
            if(message.mentions.users.first().id === message.author.id) 
                message.reply('fun fact you dont need to ping yourself to get your avatar you can simply write the command on its own'); 
    }
};