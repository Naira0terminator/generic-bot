const { Listener } = require('discord-akairo');

module.exports = class automodEvent extends Listener {
    constructor() {
        super('automod', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message) {

        // color channel cleaner | this is above the rest because it needs to delete bot messages as well.

        if(message.channel.type === 'dm') return;

        if(message.guild.id !== '646404524457721866') return;
        
        if(message.channel.id === '701954399613878404') {
            await this.client.sleep(3000);
            await message.delete();
        }

        // does a return if the message author is a bot or of the channel is a dm or if the message author is the bot owner
        if(message.author.bot || message.channel.type == 'dm' || message.author.id === this.client.ownerID) return;
        const logs = message.guild.channels.cache.get('646768239384199168')

        // Emoji restrictor
        if(message.member.roles.cache.has('667717517011189789')) {
            const unicode = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
            if(message.content.match(/^<:|>$/) || message.content.match(unicode)) return message.delete();
        }

        // link filter | image perms role overides it
        if(!message.member.roles.cache.has('662040233549889566')) {
            if(message.channel.id === '647112527460958259') return;
            if(message.content.match(/(https?:\/\/[^\s]+)/g)) {
                message.delete();
                message.author.send('You cannot send links until you are level 3.');
            }
        }
        
        // no mic channel cleaner
        if(message.channel.id === '663362180267245578') {
            const { channel } = message.member.voice;
            if(!channel) message.delete();
        }
    }
}
