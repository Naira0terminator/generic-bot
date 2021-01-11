const { Command } = require('discord-akairo');

module.exports = class loveCmd extends Command {
    constructor() {
        super('love', {
            aliases: ['love', 'wuv', 'wub'],
            channel: 'guild',
            description: 'show your affection to a user',
            args: [{
                id: 'member',
                type: 'member',
                match: 'rest',
                prompt: {
                    start: 'which member would you like to give love to?',
                    retry: 'input the name, mention or id of the user you want to give love to:',
                    retries: 1,
                }
            },
            
        ],
        });
    }
    exec(message, { member }) {

        const self = "**" + message.author.username + "**" ;
        const other = "**" + member.user.username + "**";
            
        const love = () => {
            let rand = [
                `${self} showers ${other} with all their love and affection`, 
                `${self} gives ${other} endless cuddles and kisses`, 
                `${self} treats ${other} to a night of petting puppies eating pizza and watching netflix`, 
                `${self} gives ${other} the last slice of pizza`, 
                `${self} kisses ${other} goodnight just like a true homie`, 
                `${self} gives ${other} soft forehead kisses`,
                `${self} gives ${other} love and pizza`,
                `${self} cooks ${other} a gourmet meal and tucks you into bed`,
                `${self} slides ${other} 20$ like a true homie`
            ];
            return rand[Math.floor(Math.random()*rand.length)];
        }

        const embed = this.client.util.embed()
            .setColor('RANDOM')

        if(member.id == message.author.id) 
            embed.setDescription('you\'re precious and i love you');
        else 
            embed.setDescription(love());

        message.util.send(embed);
    }
}
