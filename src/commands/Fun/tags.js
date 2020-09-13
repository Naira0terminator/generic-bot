const { Command } = require('discord-akairo');
const Tags = require('../../models/tags');

module.exports = class tagsAdd extends Command {
    constructor() {
        super('tag', {
            aliases: ['tag', 'tags', 't'],
            cooldown: 8000,
            channel: 'guild',
            args: [
                {
                    id: 'name',
                    type: 'string',
                },
                {
                    id: 'desc',
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all',
                }, 
                {
                    id: 'edit',
                    match: 'flag',
                    flag: '-edit',
                },
                {
                    id: 'del',
                    match: 'flag',
                    flag: '-del'
                },
                {
                    id: 'add',
                    match: 'flag',
                    flag: '-add',
                }
            ],
            description: {
                content: 'you can use this command to trigger an existing tag',
                examples: ['epic'],
                usage: '<tagName>'
            }

        });
    }
    async exec(message, { name, desc, all, edit, del, add }) {
        
        if(all) {
            const list = await Tags.findAll({attributes: ['name']});
            return message.util.send(this.client.util.embed()
            .setTitle('ALL tags')
            .setDescription(list.map(l => l.name).slice(1).join(', ') || 'No tags found!')
            .setColor('RANDOM')
            .setFooter(`${list.length - 1} Tags`));
        }

        if(add) {
            if(!desc || !name) return message.reply('you must provide a description!');

            if(desc.match(/nigga|nigger|niga|niger|negro|rape/)) return message.reply('a tag cannot include offensive or racial slurs');
            if(name.match(/nigga|nigger|niga|niger|negro|rape/)) return message.reply('a tag cannot include offensive or racial slurs');

            if(!name) return message.reply('you must input a name for the tag');
            if(!desc) return message.reply('you must input a description for the tag');

            if(name.length >= 15) return message.reply('your tag name must be less then 25 characters long');
            if(desc.length >= 150) return message.reply('your tag description must be less then 150 characters long');

            try {
                await Tags.create({
                    name: name,
                    description: desc,
                    username: message.author.username,
                    userID: message.author.id,
                });
                
                return message.util.send(this.client.util.embed()
                .setTitle('New tag created')
                .addField('Name:', name, true)
                .addField('Description:', desc, true)
                .setFooter(message.author.username, message.author.displayAvatarURL)
                .setColor('RANDOM'))
    
            } catch (e) {
                if(e.name === 'SequelizeUniqueConstraintError') {
                    message.reply('that tag already exists!');
                }
    
                else message.reply('there was an error adding that tag');
            }
        }

        if(!name) return message.reply('you must input a tag!');
        const tag = await Tags.findOne({where: {name: name}});
        if(!tag) return message.reply(`**${name}** does not exist!`);
        const tagID = tag.get('userID');

        if(edit) {
            await Tags.update({description: desc}, {where: {name: name}});

            if(tagID !== message.author.id) return message.reply('you can only edit your own tags');

            return message.reply(`**${name}** has been edited`);
        }

        if(del) {
            if(message.author.id === this.client.ownerID || message.member.permissions.has('ADMINISTRATOR') || message.member.roles.has('671891148779945997')) {
                await Tags.destroy({where: {name: name}});
                return message.reply(`**${name}** has been deleted!`);
            }
            if(tagID === message.author.id) {
                await Tags.destroy({where: {name: name}});
                return message.reply(`**${name}** has been deleted!`);
            }
        }

       

        let tagMember = message.guild.members.cache.get(tag.get('userID'))
        if(!tagMember) tagMember = 'Unknown';

        if(tag) {
            tag.increment('usage_count');
            const embed = this.client.util.embed()
            .addField(`**${name}**:`, tag.get('description'), true)
            .setFooter(`${!tagMember ? tag.get('username') : tagMember.user.username} • Used ${tag.get('usage_count')} times`)
            .setColor('RANDOM')
            return message.util.send(embed);
        }
    }
}