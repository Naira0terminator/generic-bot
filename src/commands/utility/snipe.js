const { Command } = require('discord-akairo');

module.exports = class snipeCmd extends Command {
    constructor() {
        super('snipe', {
            aliases: ['snipe'],
            cooldown: 8000,
            channel: 'guild',
            description: 'Shows the last deleted message/image in the channel. use -e for edits',
            args: [
                {
                    id: 'edit',
                    match: 'flag',
                    flag: '-e',
                },
            ],
        });
    }
    async exec(message, { edit }) {

        const deletedMessage = await this.client.snipes.get(message.channel.id);
        const editedMessage = await this.client.snipes.get(`edit-${message.channel.id}`);

        if(edit) {

            if(!editedMessage) return message.reply('there are no edited messages at this time!');
            return message.util.send(this.client.util.embed()
            .setAuthor(editedMessage.author.tag, editedMessage.author.displayAvatarURL())
            .setDescription(`- ${editedMessage.oldcontent}\n+ ${editedMessage.newcontent}`));
        }

        else {
            if(!deletedMessage) return message.reply('there are no deleted messages or images at this time!');

            const embed = this.client.util.embed()
            .setAuthor(deletedMessage.author.tag, deletedMessage.author.displayAvatarURL())
            .setDescription(deletedMessage.content)

            if(deletedMessage.image) embed.setImage(deletedMessage.image);

            return message.channel.send(embed);
        }
    }
}