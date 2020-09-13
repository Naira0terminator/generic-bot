const { Command } = require('discord-akairo');
const { isObject } = require('lodash');

module.exports = class dbCmd extends Command {
    constructor() {
        super('db', {
            aliases: ['db'],
            ownerOnly: true,
            channel: 'guild',
            lock: 'guild',
            args: [
                {
                    id: 'q',
                    type: 'string',
                },
                {
                    id: 'v',
                },
                {
                    id: 'dl',
                    match: 'flag',
                    flag: '-dl',
                },
                {
                    id: 'get',
                    match: 'flag',
                    flag: '-get',
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set',
                },
            ],
        });
    }
    async exec(message, { q, dl, get, set, v }) {

        if(dl) {
            try {
                if(this.client.qdb.has(q)) {
                    await this.client.qdb.delete(q);
                    return message.reply(`**${q}** has been deleted!`);
                }
                
               else return message.reply(`**${q}** Doesnt exist!`);
            } catch(err) {
                return message.reply(`there was an error deleting that entery: ${err}`);
            }
        }

        if(get) {
            try {
                if(this.client.qdb.has(q)) {
                    let data = await this.client.qdb.get(q);
                    if(isObject(data)) {
                        const store = [];
                        for(const [key, value] of Object.entries(data))
                            store.push(`${key}: ${value}`);
                        data = store;
                    }
                    if(!data) data = 'No entry found'
                    return message.reply(`\`${q}\` ${data}`);
                }

                else return message.reply(`**${q}** Doesnt exist!`);
            } catch(err) {
                return message.reply(`there was an error getting that entery: ${err}`);
            }
        } 

        if(set) {
            try {
                await this.client.qdb.set(q, v);
                return message.channel.send(`**${q}** set!`);
            } catch(err) {
                return message.reply(`error setting entery! ${err}`);
            }
        }
    }
}