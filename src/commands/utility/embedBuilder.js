const { Command } = require('discord-akairo');

module.exports = class embedCmd extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed-builder', 'embed'],
            channel: 'guild',
            cooldown: 60000,
            description: {
                content: 'a very useful embed builder',
                usage: 'yes',
            },
            args: [
                {
                    id: 'input',
                    match: 'rest',
                },
                {
                    id: 'get',
                    match: 'flag',
                    flag: '-get',
                }
            ],
        });
    }
    async exec(message, { input, get }) {
        
        const embed = this.client.util.embed();
        const object = input.split(/",/);
        
        if(get) {
            const embed = await this.client.qdb.get(`user[${message.author.id}].embed.${input}`);
            return message.channel.send({embed: embed});
        }
        
        let bound = false;
        let id;

        const constructor = {
            type: 'rich',
            title: null,
            description: null,
            color: null,
            timestamp: null,
            fields: [],
            url: null,
            thumbnail: {
                url: null
            },
            image: {
                url: null,
            },
            author: null,
            footer: {
                text: null,
                icon_url: null,
            }
        }

        for(let i = 0; i < object.length; i++) {
            // checks if the user ended the last object with a comma or not if not it will remove the last quotation mark. 
            if(i + 1 === object.length && !object[i].endsWith(',')) {
               object[i] = object[i].replace(/"/g, "");
            } 
            if(object[i].match(/description:/i)) 
                constructor.description = object[i].slice(14).trim();
            if(object[i].match(/title:/i))
                constructor.title = object[i].slice(8).trim();
            if(object[i].match(/color:/i))
                constructor.color = object[i].slice(9).trim().match(/[a-z]+/) ? object[i].slice(9).trim().toUpperCase() : object[i].slice(9).trim();
            if(object[i].match(/footer:/i))
                constructor.footer.text = object[i].slice(9).trim();
            if(object[i].match(/author:/i))
                constructor.author = object[i].slice(9).trim();
            if(object[i].match(/thumbnail:/i))
                constructor.thumbnail.url = object[i].slice(12).trim();
            if(object[i].match(/image:/i))
                constructor.image.url = object[i].slice(7).trim();
            if(object[i].match(/id:/i)) {
                bound = true;
                id = object[i].slice(4).trim();
                await this.client.qdb.set(`user[${message.author.id}].embed.${object[i].slice(4).trim()}`, constructor);
            }
        }
        console.log(object);
        if(bound) return message.channel.send(`Embed Created and bound to id: **${id}**`, {embed: constructor});

        message.channel.send(message.author, {embed: constructor});
    }
}