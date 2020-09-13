const { Command } = require('discord-akairo');

module.exports = class promoteCmd extends Command {
    constructor() {
        super('promote', {
            aliases: ['promote'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            args: [{
                id: 'member',
                type: 'member',
            },
            {
                id: 'helper',
                match: 'flag',
                flag: 'helper'
            },
            {
                id: 'mod',
                match: 'flag',
                flag: 'mod'

            },
            {
                id: 'senior',
                match: 'flag',
                flag: 'senior'
            },
            {
                id: 'pm',
                match: 'flag',
                flag: 'pm'
            }
        ],
        });
    }
    async exec(message, { member, helper, mod, senior, pm}) {
        
        const promotionMessage = {
            helper: `${member.user.username}, you have been promoted to a helper. this is the first step towards becoming a staff member. to get promoted you must show that you can enforce the rules well. you can use the \`-warn\` command`,
            mod: `${member.user.username}, you have been promoted to a moderator. you have the same duties as before but with added authority and now you can mute members and see logs welcome to the staff team.`,
            senior: `${member.user.username}, you have been promoted to a senior staff member. your job is the same as before but with added responsibility and power. you can now ban members using \`-ban\` and you are responsible for guiding other staff members`,
            pm: `welcome to the partner team were glad too have you.\n\nwrite \`,ad\` for our server description.\n\n**Information**:\n\n💠We do not have a member requirement you can partner with servers of any size\n\n\💠 servers you are partering with must not be toxic and they must follow discords terms of service\n\n\💠 you are allowed to deny any partnership if they require you too rep or ping everyone or here\n\n\💠 you are also allowed to deny any partnerships if a person is being very rude.`
        }
        
        if(!member) return message.reply('you must provide a valid member!');  
        
        const promote = (rank, {add = null, remove = null}) => {
            if(add)
                member.roles.add(add);
            if(remove)
                member.roles.remove(remove);
            
            message.channel.send(this.client.util.embed()
            .setDescription(`**${member.user.username}** has been promoted to ${rank}`)
            .setColor('GREEN'));

            let rankMessage;

            switch(rank) {
                case 'helper':
                    rankMessage = promotionMessage.helper
                    break;
                case 'mod':
                    rankMessage = promotionMessage.mod;
                    break;
                case 'senior':
                    rankMessage = promotionMessage.senior;
                    break;
                case 'pm':
                    rankMessage = promotionMessage.pm;
                    break;
            }

            member.send(this.client.util.embed()
            .setDescription(rankMessage)
            .setColor('GREEN'));

        } 
        
        if(helper)
            return promote('helper', {add:'646423843279208469'}); 
        if(mod)
            return promote('mod', {add: ['646764942795472906', '666448061639426070'], remove: '646423843279208469'});
        if(senior)
            return promote('senior', {add: ['663625243470069773', '666448061639426070'], remove: ['646764942795472906', '646423843279208469']});
        if(pm)
            return promote('pm', {add: ['647399478965305374']});

    }
}
