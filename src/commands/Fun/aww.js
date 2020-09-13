const { Command } =  require('discord-akairo');
const fetch = require('node-superfetch');

module.exports = class awwCmd extends Command {
    constructor() {
        super('aww', {
            aliases: ['aww', 'cute'],
            cooldown: 8000,
            description: 'get a random cute picture from reddit',
            lock: 'channel',
            channel: 'guild',
            args: [
                {
                    id: 'get',
                },
            ],
        });
    }
    async exec(message) {
        
        let linkArray = [
            'https://www.reddit.com/r/cats/top.json?sort=top', 
            'https://www.reddit.com/r/catbellies/top.json?sort=top', 
            'https://www.reddit.com/r/catpictures/top.json?sort=top',
            'https://www.reddit.com/r/rarepuppers/top.json?sort=top', 
            'https://www.reddit.com/r/lookatmydog/top.json?sort=top',
            'https://www.reddit.com/r/Rabbits/top.json?sort=top',
        ]

        const { body } = await fetch
       .get(linkArray[Math.floor(Math.random() * linkArray.length)])
       .query({ limit: 25});

       const reddit = body.data.children
       const randomPost = reddit[Math.floor(Math.random() * reddit.length)];
       if (!reddit.length) return message.channel.reply('i could not find any results try again later!');
       
       const embed = this.client.util.embed()
       .setURL(`${randomPost.data.url}`)
       .setTitle(randomPost.data.title)
       .setImage(randomPost.data.url || randomPost.data.image)
       .setColor('RANDOM')
       .setFooter(`${message.member.user.username}   | 👍: ${randomPost.data.ups}   | 💬: ${randomPost.data.num_comments}`, message.member.user.avatarURL)
       await message.channel.send(embed);
    }
}