const Discord = require("discord.js");
const main = require("../index.js");
const config = require("../config.json");
const fs = require("fs");

const ytdl = require('ytdl-core');

const cmdList = require('./commands.json');
const ff = require('./ff.json')

const playSound = async (msg, audio) => {
  if (audio == null) return false;

  try {
    if (!fs.existsSync(`./sounds/${audio}`)) {
      msg.channel.send(`No existe ese archivo`)
      return false;
    }
  } catch (err) { console.log(err); }

  if (msg.member.voice.channel.joinable) {
    let voiceChannel = msg.member.voice.channel;
    voiceChannel
      .join()
      .then(connection => {
        const dispatcher = connection.play(`./sounds/${audio}`);

        dispatcher.on("finish", end => {
          voiceChannel.leave();
          console.log("Successfully played a sound.");
        });
      })
      .catch(err => console.log(err));
  }
  else {
    msg.channel.send(`No me puedo unir a tu canal de voz imbécil`);
  }
};

const Random = async (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
  ayuda: async msg => {
    const embed = new Discord.MessageEmbed().setTitle("Command List");
    let base = []; let fun = []; let extra = []; let sound = [];

    for (let i = 0; i < cmdList.length; i++) {
      let cmd = '`' + `${cmdList[i].name} / ${cmdList[i].short} : ${cmdList[i].description}` + '`';
      switch (cmdList[i].category) {
        case 'fun':
          fun += fun.length > 0 ? `\n${cmd}` : `${cmd}`;
          break;
        case 'extra':
          extra += extra.length > 0 ? `\n${cmd}` : `${cmd}`;
          break;
        case 'sound':
          sound += sound.length > 0 ? `\n${cmd}` : `${cmd}`;
          break;
        default:
          base += base.length > 0 ? `\n${cmd}` : `$${cmd}`;
          break;
      }
    }

    embed
      .addField(
        `Comandos meme`,
        `${fun}`,
        false
      )
      .addField(
        ` Comandos de sonido `,
        `${sound}`,
        false
      )
      .addField(
        `Comandos extras`,
        extra,
        false
      )

    msg.channel.send({ embed });
    return false;
  },

  inspeccion: async (msg) => {
    let user = msg.mentions.users.first() != null ? msg.mentions.users.first() : msg.author;
    let com = "Lorem ipsum";
    let tula;
    if (msg.mentions.users.first())
      tula = msg.mentions.users.first().tag.split("#")[1] / 100;
    else
      tula = msg.author.tag.split("#")[1] / 100;

    if (tula > 30) tula = tula / 3;

    if (tula >= 15) com = "Excelente diametro del tronco";
    else if (Math.floor(tula) === 5)
      com =
        "*Es la legendaria espada de* ***5cm***, dios te bendiga en tus viajes.";
    else if (tula < 5)
      com = "Es **tan** mala, deja mucho que desear. ***NO PASASTE MI PANA***.";
    else if (tula < 10) com = "Podría ser mejor pero pasaste";
    else if (tula < 15) com = "Buena tula, pasaste mi pana";

    const embed = new Discord.MessageEmbed()
      .setTitle(`Tamaño de la pinga de ${user.username}`)
      .setThumbnail(user.avatarURL())
      .addField(tula.toFixed(2) + "cm", com, false);

    msg.channel.send({ embed });
    return false;
  },

  aaa: async msg => {
    playSound(msg, 'viper.mp3');
  },

  buenasnoches: async msg => {
    playSound(msg, 'buenasnoches.mp3');
  },

  ecsilud: async msg => {
    playSound(msg, 'exitlude.mp3');
  },

  impressive: async msg => {
    playSound(msg, 'impressive.mp3');
  },

  nium: async msg => {
    playSound(msg, 'gyrocopter.mp3');
  },

  yoda: async msg => {
    playSound(msg, "Lego yoda death sound.mp3");
  },

  kulikitaka: async msg => {
    playSound(msg, "kulikitaka.mp3");
  },

  lacon: async msg => {
    playSound(msg, "laconchadea.mp3");
  },

  votekilti: async msg => {
    const filter = (reaction, user) => {
      return reaction.emoji.name === '✅' && !user.bot;
    }

    let user = msg.mentions.users.first() != null ? msg.mentions.users.first() : null;
    if (user == null) {
      msg.channel.send(`Tenes que etiquetar un usuario kpo`);
      return false;
    }

    const embed = new Discord.MessageEmbed()
      .setColor(0xffff00)
      .setThumbnail(user.avatarURL)
      .setTitle(`VOTEKILTI`)
      .addField(`Si ${user.username} tiene el pito chico vota ✅`, `jaja meme`, false)
      .setThumbnail(user.avatarURL())

    msg.channel.send(embed)
      .then(msg => {
        msg.react('✅')
        msg.awaitReactions(filter, { max: 2, time: 20000, errors: ['time'] })
          .then(collected => {
            msg.channel.send(`https://i.imgur.com/RjInJnv.png`)
            msg.channel.send(`<@${user.id}> TIENE LA PICHULA CHICA`)
          })
          .catch(collected => console.log(`After 7.5 seconds, only ${collected.size} out of 2 reacted`))
      })

    return false;
  },

  fanfi: async msg => {
    let ffID = await Random(0, ff.length - 1);
    let fraseID = await Random(0, ff[ffID].length);
    console.log(`${ffID} : ${fraseID}`);
    let text = await ff[ffID][fraseID].frase;

    let message = `**Geilty Fanfic** *Tomo ${ffID}:${fraseID}*\n> ${text}\n*By zafire 공산#8600*`;

    msg.channel.send(message)
  },

  source: async msg => {
    msg.channel.send(`El source esta en https://github.com/GabrielSattler/Kilti-Bot salu3`);
  },

  tpa: async msg => {
    let user = msg.mentions.users.first() != null ? msg.mentions.users.first() : null;
    if (user == null) {
      msg.channel.send(`Tenes que etiquetar a un usuario kpo`);
      return false;
    }

    const filter = (reaction, reactor) => {
      let response = reaction.emoji.name === '✅' ? '✅' : '❌';
      return response != null && reactor.username === user.username;
    }

    const embed = new Discord.MessageEmbed()
      .setColor(0xffffff)
      .setTitle(`Solicitud de TP`)
      .addField(`${msg.author.username.toUpperCase()} ESTA POR MORIR Y QUIERE TELETRANSPORTARSE A VOS, ACEPTAS?`, `Apreta ✅ para aceptar o ❌ para rechazar`, false);

    msg.channel.send(embed)
      .then(nmsg => {
        try {
          nmsg.react('✅')
            .then(() => nmsg.react('❌'))
            .catch(err => console.log(err))
        } catch (error) { console.log(error) }
        nmsg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
          .then(collected => {
            msg.channel.send(`https://tenor.com/35RL.gif`);
            msg.channel.send(`${user.username} acepto el tp de ${msg.author.username}`);
          }).catch(collected => {
            msg.channel.send(`https://tenor.com/bmMqX.gif`);
            msg.channel.send(`${user.username} no acepto el tp, llevando a la muerte de ${msg.author.username}`)
          })
      })
  },

  cuidado: async msg => {
    msg.channel.send(`https://i.imgur.com/NcGXyEx.png`)
  },

  regalo: async msg => {
    msg.channel.send(`https://i.imgur.com/X4NEtHi.png`)
  }
};
