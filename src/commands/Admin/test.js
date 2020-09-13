const { Command } = require('discord-akairo');
const { promisify } = require('util');
const ytdl = require('ytdl-core');

module.exports = class TestCmd extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            lock: 'channel',
            ownerOnly: false,
            cooldown: 12000,
            ignoreCooldown: message => {
                const staff = message.guild.roles.cache.get('589777016895701002');
                let ids = [];
                staff.members.forEach(member => ids.push(member));
                return ids;
            },
            args: [
               {
                   id: 'arg',
                   type: 'string',
                   match: 'rest'
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
               }
            ]
        });
    }
    async exec(message, { arg, get, set }) {

        if(arg === 'create') {
            const sql = 'CREATE TABLE IF NOT EXISTS test (userID text(20), msg text(1440))';
            this.client.sql.query(sql, (err, result) => {
                if(err) return message.reply(`error creating table! ${err}`);
                message.channel.send(`table created`, result);
            });
        }

        if(set) {
            const sql = `INSERT INTO test (userID, msg) VALUES (${message.author.id}, ${arg})`;
            this.client.sql.query(sql, (err, result) => {
                message.channel.send('inserted into info! ' + result);
            });
            return;
        }

        if(get) {
            const sql = `SELECT userID, msg FROM test where userID=${message.author.id}`;
            const data = await this.client.sql.query(sql, function(err, result) {
                return message.channel.send(`result: ${result}`);
            });
        }
    }
}