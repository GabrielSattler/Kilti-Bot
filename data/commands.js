const Discord = require("discord.js");
const main = require("../index.js");
const config = require("../config.json");

const ytdl = require('ytdl-core');

const cmdList = require("./commands.json");
const ff = require('./ff.json')

const playSound = async (msg, audio) => {
  if (audio == null) return false;

  if (msg.member.voice.channel.joinable) {
    let voiceChannel = msg.member.voice.channel;
    voiceChannel
      .join()
      .then(connection => {
        const dispatcher = connection.play(audio);

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

    for (let i = 0; i < cmdList.length; i++) {
      embed.addField(
        `${config.prefix} ${cmdList[i].name} / ${config.prefix} ${cmdList[i].short}`,
        `${cmdList[i].description}`,
        false
      );
    }

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

  AAA: async msg => {
    playSound(msg, "https://cdn.glitch.com/72701dbe-95f1-4736-8882-b638e47d30d5%2Fviper.mp3?v=1598174251718");
  },

  BUENASNOCHES: async msg => {
    playSound(msg, "https://cdn.glitch.com/72701dbe-95f1-4736-8882-b638e47d30d5%2FBUENAS%20NOCHES%20AMERICA.mp3?v=1598219246188");
  },

  ecsilud: async msg => {
    playSound(msg, "https://cdn.glitch.com/72701dbe-95f1-4736-8882-b638e47d30d5%2FExitlude.mp3?v=1598235233072");
  },

  impressive: async msg => {
    playSound(msg, "https://cdn.glitch.com/72701dbe-95f1-4736-8882-b638e47d30d5%2FImpressive.mp3?v=1598250293667");
  },

  NIUM: async msg => {
    playSound(msg, "https://cdn.glitch.com/72701dbe-95f1-4736-8882-b638e47d30d5%2Fnium.mp3?v=1598253794115");
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
      .addField(`Si ${user.username} tiene el pito chico vota ✅`, `Si no tiene el pito chico vota ❌`, false)
      .setThumbnail(user.avatarURL())

    msg.channel.send(embed)
      .then((msg) => {
        msg.react('✅')
        msg.awaitReactions(filter, { max: 1, time: 7500, errors: ['time'] })
          .then(collected => {
            console.log(collected);
            msg.channel.send(`<@${user.id}> TIENE LA PICHULA CHICA`)
          })
          .catch(collected => console.log(`After 7.5 seconds, only ${collected.size} out of 2 reacted`))
      })

    return false;
  },

  fanfi: async msg => {
    let rng = await Random(0, ff.length);
    let text = await ff[rng];

    const embed = new Discord.MessageEmbed()
      .setColor(0x00ff00)
      .setAuthor(`Geilty Fanfic`, `https://cdn.discordapp.com/avatars/746974782653988924/a72e318ccda9ef9564b65bb5f7c4ba4c.png?size=4096`)
      .setTitle(`Geilty, 69:${rng}`)
      .addField(`${text.frase}`, `By zafire공산#8600`, false)
      .setThumbnail(`https://cdn.discordapp.com/avatars/746974782653988924/a72e318ccda9ef9564b65bb5f7c4ba4c.png?size=4096`)

    msg.channel.send(embed)
  }
};
