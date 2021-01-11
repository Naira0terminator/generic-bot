const { Command } = require('discord-akairo');

module.exports = class killCmd extends Command {
    constructor() {
        super('kill', {
            aliases: ['kill', 'murder', 'exterminate'],
            channel: 'guild',
            description: 'show your affection to a user',
            args: [{
                id: 'member',
                type: 'member',
                match: 'rest',
                prompt: {
                    start: 'which member would you like to kill?',
                    retry: 'input the name, mention or id of the user you want to kill:',
                    retries: 1,
                }
            },
            
        ],
        });
    }
    exec(message, { member }) {

        const self = "**" + message.author.username + "**" ;
        const user = "**" + member.user.username + "**";
            
        const rand = () => {
            let rand = [ 
                `${self} assassinates ${user} JFK style... ugh convertibles!`,
                `${self} kills ${user} or did they?`,
                `${self} TERMINATES ${user} gET TO ZE CHOPPUR!`,
                `${self} watches ${user} spontaneously combust.`,
                `${self} exterminates ${user} like the rat they are.`,
                `${self} staby-stabs ${user} >:)`,
                `${self} obliterates ${user}... with a spoon?`,
                `${self} pushes ${user} down the stairs.`,
                `${self} incinerates ${user} they need some milk!`,
                `${self} dismembers ${user} FATALITY!`,
                `${self} poisons ${user} wait.. WRONG GLASS!!`
            ];
            return rand[Math.floor(Math.random()*rand.length)];
        }

        const embed = this.client.util.embed()
            .setColor('RANDOM')

        if(member.id == message.author.id) 
            embed.setDescription('suicide isnt the answer... expensive hookers and cocaine is the answer!');
        else 
            embed.setDescription(rand());

        message.util.send(embed);
    }
}
