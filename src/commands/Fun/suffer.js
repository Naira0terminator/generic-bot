const { Command } = require('discord-akairo');

module.exports = class sufferCmd extends Command {
    constructor() {
        super('suffer', {
            aliases: ['suffer'],
            channel: 'guild',
            description: 'make the person you hate the most suffer',
            args: [{
                id: 'member',
                type: 'member',
                prompt: {
                    retry: 'input the name, mention or id of the user you want to make suffer:',
                    retries: 2,
                }
            }],
        });
    }
    exec(message, { member }) {

        const other = "**" + member.user.username + "**";
            
        function suffer() {
            var rand = [
            `${other} was forced too watch non stop furry porn`, 
            `${other}\'s burger was served cold`, 
            `${other} has been forced to sit through all 3 hours of the new transformer movie`, 
            `${other} was chased by an aligator`, 
            `${other} was beaten up by a kangaroo`, 
            `${other} became a vsco girl, oh no wheres your hydro flaskskskskk`, 
            `${other} had their candy stolen just like a baby.`,
            `${other} forces you to listen too 8 hours of a sitcom laugh track`,
            `${other} was given a prostate exam by Wolverine`,
            `${other} was forced to eat 16 kelp burgers`,
            `${other} was chased by a flying cockroach`,
            `${other} had a drunken one night stand with the mcdonalds clown`,
            `${other} had there pc shutdown at the end of there essay, the essay wasnt saved at all`
            ];
            return rand[Math.floor(Math.random()*rand.length)];
        }
        
        
        message.channel.send(this.client.util.embed()
        .setDescription(suffer())
        .setColor('RANDOM'))

    }
}
