const { Listener } = require('discord-akairo');

module.exports = class welcomeEvent extends Listener {
    constructor() {
        super('welcome', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member) {
        
        const data = await this.client.qdb.get(`guild[${member.guild.id}].join`);
        if(!data) return;

        const joinChannel = await member.guild.channels.cache.get(data.channel);
        if(!joinChannel) return;

       const memberName = member.user.username;
       const memberMention = member.user;
       const serverName = member.guild.name;
       const memberCount = member.guild.members.cache.size;

       const format = data.message
       .replace('{memberName}', `${memberName}`)
       .replace('{memberMention}', `${memberMention}`)
       .replace('{serverName}', `${serverName}`)
       .replace('{memberCount}', `${memberCount}`);

        if(member.user.bot) {
            await member.roles.add('646759560702590986') // bots role
            await member.roles.add('650749039213543467') // beep boop role

            const embed = new Discord.RichEmbed()
            .addField('New bot added:', `**${mem.user.username}** has been added to the server *beep boop*`)
            .setFooter(`${mem.guild.name} now has ${bots} bots!`)
            .setColor('RANDOM')
            return joinChannel.send(embed);
        }

        const joinMessage = await joinChannel.send(member.user, this.client.util.embed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setThumbnail('https://toomuchcutedotcom.files.wordpress.com/2011/06/welcome1.png')
        .setDescription(`__**We have a new member!**__\n\nFor roles and a name color check <#663372069110808586> & <#701954399613878404>.\n\nAnd be sure to read <#646412856241160230> to understand our servers rules and punishments.`)
        .setColor('RANDOM')
        .setFooter(`Member count: ${memberCount}`));

        this.client.newMember.set(`${member.guild.id}-${member.id}`, {
            messageID: joinMessage.id,
            messageChannel: joinChannel.id,
            messageDate: joinMessage.createdAt,
            userJoinDate: member.joinedAt,
            userID: member.id,
        });
    }
}
