const { Listener } = require('discord-akairo');

module.exports = class catchEvent extends Listener {
    constructor() {
        super('catch', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message) {

        if(message.author.bot || message.channel.type === 'dm') return;

        const guildCatchData = await this.client.redis.get(`guild[${message.guild.id}]-catch-channel`);
        const catchState = await this.client.redis.get(`guild[${message.guild.id}]-catch-state`);

        const channel = !guildCatchData ? null : message.guild.channels.cache.get(guildCatchData);

        if(!channel) return;
        if(catchState === 'off') return;

        let isCaught = false;

        const prefixArray = ['/', '!', '.', '<'];
        const suffixArray = ['get', 'catch', 'gimme', 'mine'];
        const prefix = prefixArray[Math.floor(Math.random() * prefixArray.length)];
        const suffix = suffixArray[Math.floor(Math.random() * suffixArray.length)];
        const catchWord = prefix + suffix;
        
       if(channel.id === message.channel.id) {
          const chance = Math.floor(Math.random() * 100);

          if(chance < 3) {
            const filter = message => message.content.toLowerCase().includes(catchWord) && !message.member.user.bot; 
            const collector = message.channel.createMessageCollector(filter, { time: 10000});
            message.channel.send(`🐱 | a wild cat appears catch it with \`${catchWord}\``).then(m => m.delete({timeout: 10000}));

            collector.on('collect', async message => {
                if(isCaught === false) {
                    const amount = await this.client.redis.zincr(`guild[${message.guild.id}]-catch`, 1, `${message.author.id}`);
                    message.channel.send(`caught by **${message.author.tag}**. total cats: \`${amount}\``).then(m => m.delete({timeout: 5000}));
                    isCaught = true
                }
            });

            collector.on('end', collected => {
                // alternative way to delete collected messages. this deletes it at the end instead of 3 seconds after collected.
                collected.forEach(msg => msg.delete());
                if(isCaught === false) message.channel.send('no one caught it in time!').then(m => m.delete({timeout: 5000}));
            });
          }
        }
    }
}