const { Command } = require('discord-akairo');
const jimp = require('jimp');

module.exports = class ColorCmd extends Command {
    constructor() {
        super('color', {
            aliases: ['color'],
            cooldown: 8000,
            description: {
                content: 'shows you your own color with an image or a given hex color',
                examples: ['#73ADB9'],
                usage: '<color>'
            },
            args: [{
                id: 'color',
                type: 'string',
            },
            {
                id: 'member',
                type: 'member',
            }
        ],
        });
    }
    exec(message, { color, member}) {

        
        if(!color) {

            new jimp(225, 225, message.member.displayHexColor, (err, image) => {
                if(err) throw err;
                image.write('../../images/color.png')
                const FileEmbed = this.client.util.embed()
                .attachFiles(['../../images/color.png'])
                .setThumbnail('attachment://color.png')
                .setColor(message.member.displayHexColor)
                .addField('Hex color', `${message.member.displayHexColor}`)
                message.util.send(FileEmbed);  
            });

            return;
        }
        
        if(color.length > 7 || color.length < 7 && !color.match(/^#\w+/)) 
            return message.reply('you must input a correct hex color format');
        
        new jimp(225, 225, color, (err, image) => {
            if(err) throw err;
            image.write('../../images/color.png')
            
            const FileEmbed = this.client.util.embed()
            .attachFiles(['../../images/color.png'])
            .setThumbnail('attachment://color.png')
            .setColor(color)
            .addField('Hex color', `${color}`)
            message.util.send(FileEmbed);
        });
    }
}