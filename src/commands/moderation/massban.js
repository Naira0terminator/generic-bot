const { Command } = require('discord-akairo');

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
                    id: 'get',
                    match: 'rest',
                },
            ],
            
        });
    }
    async exec(message,  { get }) {

        const getPerms = await this.client.qdb.get(`guild[${message.guild.id}].perms.massban`);
        const banRole = await message.guild.roles.cache.get(getPerms);

        if(banRole) 
            if(!message.member.roles.cache.has(banRole.id) && !message.member.permissions.has('ADMINISTRATOR')) 
                return message.reply('You do not have permissions to use the massban command!');

        if(!get) return message.reply('you must provide atleast one user to ban!');

        if(message.mentions.users.size) {

            if(message.mentions.users.size > 20) return message.reply('you cannot ban more then 20 users at a time!');

            let userIds = [];
            message.mentions.members.forEach(members => userIds.push(members.id));
            if(userIds.includes(message.author.id)) return message.reply('you cant ban yourself silly... unless?');
                
            let banEnd = [];
            message.mentions.members.forEach(members => {
                if(message.member.roles.highest.rawPosition <= members.roles.highest.rawPosition) return banEnd.push('yes');
            });
            if(banEnd.length > 0) return message.reply('one or more of the provided user ids have roles above you!');
            const banning = await message.util.send(`banning \`${message.mentions.users.size}\` members`);
            try {
                await message.mentions.members.forEach(async members => await message.guild.members.ban(members, {days: 7, reason: `mass banned by: ${message.author.tag}`}));
            } catch(err) {
                console.log(err);
                return message.reply('one or more users could not be banned!');
            }
            
            return await banning.edit(`\`${message.mentions.users.size}\` members have been banned!`);

        }

        const userIDs = get.split(/\s|\n/g);
        let filterIDs = userIDs.filter(item => item);
        
        if(filterIDs.includes(message.author.id)) {
            filterIDs = filterIDs.filter(item => item !== message.author.id);
        }

        if(filterIDs.length > 20) return message.reply('you cannot mass ban more then 20 users at a time!');

        let userEnd = [];
        userIDs.forEach(id => {
            let getMembers = message.guild.members.cache.get(id);
            if(getMembers) 
              if(message.member.roles.highest.rawPosition <= getMembers.roles.highest.rawPosition) 
                  userEnd.push(getMembers.id);
        });

        if(userEnd.length > 0) return message.reply('one or more of the provided user ids have roles above you!');

        const banning = await message.util.send(`banning \`${filterIDs.length}\` members`);

        let banCount = [];
        try {
           await filterIDs.forEach(async id => {
              await message.guild.members.ban(id, {days:7, reason: `mass banned by: ${message.author.tag}`}).then(banCount.push(id)
            )});
        } catch(err) {
            console.log(err);
            message.reply('one or more users could not be banned!');
        }
        
        await banning.edit(`\`${banCount.length}\` members have been banned!`);

        
    }
}
