const { Command } = require('discord-akairo');
const fetch = require('node-superfetch');

module.exports = class testmemeCmd extends Command {
    constructor() {
        super('meme', {
            aliases: ['meme'],
            cooldown: 8000,
            lock: 'channel',
            description: 'returns a random meme from multiple subreddits'
        });
    }
    async exec(message) {

       let url = ['https://www.reddit.com/r/memes/top.json?sort=top', 'https://www.reddit.com/r/dankmemes/top.json?sort=top'];

       const sending = await message.channel.send('finding dank memes...');

       const { body } = await fetch
       .get(url[Math.floor(Math.random() * url.length)])
       .query({ limit: 25});

       const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
       const randomnumber = Math.floor(Math.random() * allowed.length)

       if (!allowed.length) return sending.edit('it seems there are no new dank memes at the moment!');
       
       const embed = this.client.util.embed()
       .setURL(`${allowed[randomnumber].data.url}`)
       .setTitle(allowed[randomnumber].data.title)
       .setImage(allowed[randomnumber].data.url || allowed[randomnumber].data.image)
       .setColor('RANDOM')
       .setFooter(`${message.member.user.username}   | 👍: ${allowed[randomnumber].data.ups}   | 💬: ${allowed[randomnumber].data.num_comments}`, message.member.user.avatarURL)
       await sending.edit(embed);
        
    }
}
