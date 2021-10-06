const { SlashCommandBuilder } = require("@discordjs/builders");
const { join } = require("path");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("audio")
    .setDescription("Sonidos graciosos jaja")
    .addStringOption((option) =>
      option
        .setName("sonido")
        .setDescription("Que audio queres reproducir")
        .setRequired(true)
        .addChoice("Viper", "viper.mp3")
        .addChoice("Buenas Noches", "buenasnoches.mp3")
        .addChoice("Ecsilud", "exitlude.mp3")
        .addChoice("Nium", "gyrocopter.mp3")
        .addChoice("Lego Yoda", "Lego yoda death sound.mp3")
        .addChoice("Kulikitaka", "kulikitaka.mp3")
        .addChoice("Lacon", "laconchadea.mp3")
        .addChoice("Loca de Mierda", "locamierda.mp3")
        .addChoice("Chupame la pija", "chupamelapija.mp3")
        .addChoice("Impressive", "impressive.mp3")
        .addChoice("Oof", "oof.mp3")
    ),
  async execute(interaction) {
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
    });

    let sound = interaction.options.get("sonido").value;
    console.log(sound);

    try {
      if (!fs.existsSync(join(__dirname, `sounds/${sound}`))) {
        interaction.reply({ content: "Ese audio no existe", ephemeral: true });
      } else {
        sound = createAudioResource(join(__dirname, `sounds/${sound}`));
      }
    } catch (err) {
      throw err;
    }

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    connection.subscribe(player);
    player.play(sound);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    interaction.reply({ content: "Reproduciendo el audio.", ephemeral: true });
  },
};
