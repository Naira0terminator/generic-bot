const { Command } = require('discord-akairo');
const translate = require('@vitalets/google-translate-api');

module.exports = class transCmd extends Command {
    constructor() {
        super('translate', {
            aliases: ['translate', 'trans'],
            cooldown: 8000,
            lock: 'channel',
            description: {
                content: 'translate any language to another',
                usage: '<translate from> <translate to> message',
                examples: ['english spanish hi there', 'es en hola'],
            },
            args: [
                {
                    id: "from",
                },
                {
                    id: "to",
                },
                {
                    id: "word",
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message, { from, to, word }) {

        try {   

            translate(word, {from: from, to: to}).then(res => {
            message.util.send(this.client.util.embed()
            .setDescription(`**${translate.languages[from]} -> ${translate.languages[to]}**: ${res.text}`)
            .setColor('RANDOM'))});

        } catch (error) {
            console.log(error);
            return message.reply('that is not a valid translation format try: <prefix>translate <translate from> <translate to> message');
        }
    }
    
}