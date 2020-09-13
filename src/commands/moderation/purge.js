const { Command, Argument } = require('discord-akairo');
const unicode = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

module.exports = class cleanCmd extends Command {
    constructor() {
        super('clean', {
            aliases: ['purge', 'clean', 'prune', 'delete', 'dl'],
            userPermissions: ['MANAGE_MESSAGES'],
            description: {
                content: 'deletes up to the last 100 messages in the channel.',
                usage: '<amount> <filter>\nyou can (optionally) use one of the following filters.\n\`Bot | link | image | emote | member\`',
                examples: ['50 bots', '20 image'],
            },
            args: [
                {
                    id: 'amount',
                    type: 'integer',
                    default: 10,
                },
                {
                    id: 'filter',
                    type: Argument.compose('lowercase', 'string')
                },
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message, { amount, filter, member }) {
        
        await message.delete();
        let msgFilter;

        if (filter) {
            if (filter.match(/bot|bots/)) {
                msgFilter = msg => msg.author.bot;
            }
            else if (filter.match(/link|links/)) {
                msgFilter = msg => msg.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1;
            }
            else if (filter.match(/img|images|image/)) {
                msgFilter = msg => msg.attachments.size !== 0;
            }
            else if (filter.match(/emote|emotes|emoji|emojis/)) {

                msgFilter = msg => msg.content.match(/<:\w+:\d+>/);
            }
            else if (filter.match(/member|mem|user/)) {
                if (member) {
                    msgFilter = msg => msg.author.id === member.user.id;
                }
                else return message.reply('You must Provide a valid member!');
            }
            else {
                return message.reply('that is not a valid filter.');
            }

            const getMessages = await message.channel.messages.fetch({ limit: 100 }).catch(err => null);
            const deleteMsg = getMessages.filter(msgFilter);
            return message.channel.bulkDelete(deleteMsg.array().reverse()).catch(err => null);
        }

        const getMessages = await message.channel.messages.fetch({limit: amount }).catch(err => null);
        message.channel.bulkDelete(getMessages.array().reverse()).catch(err => null);
    }
}