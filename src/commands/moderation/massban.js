const { Command } = require('discord-akairo');
const ms = require('ms')

module.exports = class testCmd extends Command {
    constructor() {
        super('massban', {
            aliases: ['massban', 'ban2'],
            clientPermissions: ['BAN_MEMBERS'],
            description: {
                content: 'Bans up to 20 members or users at once. if logging is set up it will send the link of the last 250 messages to the logging channel',
                usage: '@members/userIDs',
                examples: ['@user1 @user2 @user3']
            },
            args: [
                {
                    id: 'user',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message,  { user }) {

        const getPerms = await this.client.qdb.get(`guild[${message.guild.id}].perms.massban`);
        const banRole = await message.guild.roles.cache.get(getPerms);

        if(!banRole) 
            return message.reply("No ban perms have been setup.");

        if(!message.member.roles.cache.has(banRole.id)) 
            return message.reply('You do not have permissions to use the massban command!');

        if(!user) 
            return message.reply("You must provide at least one user.");

        let users = user.split(/\s+/);

        await message.util.send(`Banning \`${users.length}\` users...`);

        if(users.length > 20) 
            return message.util.reply("You cannot massban more then 20 users at a time.");
        
        let couldNotBan = {
            count: 0,
            users: []
        };

        let banned = 0;

        const start = process.hrtime();

        for(let i = 0; i != users.length; i++) {
            
            let userObj = users[i];
            userObj = message.guild.members.cache.get(userObj.match(/^<@!*\d+>$/) ? userObj.slice(3, userObj.indexOf('>')) : userObj);

            if(userObj) {
                if(message.member.roles.highest.rawPosition <= userObj.roles.highest.rawPosition)
                    continue;
            }

            if(!userObj) 
                userObj = users[i];
            
            if((userObj.id || userObj) === message.author.id) 
                continue;

            try {
                await message.guild.members.ban(userObj, {days:7, reason: `Mass banned by: ${message.author.tag}`});
            } catch(err) {
                couldNotBan.count++
                couldNotBan.users.push(userObj);
                continue;
            }

            banned++;
        }

        const end = process.hrtime(start);

        let banMessage = `Banned \`${banned}\` users in **${ms((end[0]* 1000000000 + end[1]) / 1000000, {long: true})}**`

        if(couldNotBan.count > 0) 
            banMessage += `\nCould not ban \`${couldNotBan.count}\` users [${couldNotBan.users.join(',')}]`;
        
        if(couldNotBan.count > 0 && banned < 1) 
            banMessage = "Could not ban any of the provided users";

        message.util.send(banMessage);
    }
}