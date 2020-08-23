const Discord = require('discord.js');
const main = require('../main.js');
const config = require('../config.json');

const cmdList = require('./commands.json');

module.exports = {
    ayuda : async(msg) => { 
        const embed = new Discord.MessageEmbed()
            .setTitle("Command List")

        for(let i = 0; i < cmdList.length; i++){
            embed.addField(`${config.prefix} ${cmdList[i].name}/${config.prefix} ${cmdList[i].short}`, `${cmdList[i].description}`, false)
        }

        msg.channel.send({embed});
        return false;
    },

    inspeccion : async(msg) => {
        let tula = msg.author.tag.split('#')[1] / 100;
        let com = 'Lorem ipsum';

        if(tula >= 15)
            com = 'Excelente diametro del tronco'
        else if (tula === 5)
            com = '*Es la legendaria espada de* ***5cm***, dios te bendiga en tus viajes.'
        else if (tula < 5)
            com = 'Es **tan** mala, deja mucho que desear. ***NO PASASTE MI PANA***.'
        else if (tula < 10)
            com = 'Podría ser mejor pero pasaste'
        else if (tula < 15)
            com = 'Buena tula, pasaste mi pana'

        const embed = new Discord.MessageEmbed()
            .setTitle(`Tamaño de la pinga de ${msg.author.username}`)
            .setThumbnail(msg.author.avatarURL())
            .addField(tula + "cm", com, false)

        msg.channel.send({embed});
        return false;
    }
}