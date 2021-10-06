const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tpa")
    .setDescription("Tepeate a un pete")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario al que te queres tepear")
        .setRequired(true)
    ),
  async execute(interaction) {
    const embed = new Discord.MessageEmbed()
      .setColor(0xffffff)
      .setTitle(`Solicitud de TP`)
      .addField(
        `${interaction.user.username} ESTA POR MORIR Y QUIERE TELETRANSPORTARSE A VOS, ACEPTAS?`,
        `Apreta ✅ para aceptar o ❌ para rechazar`,
        false
      );

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
    message.react("✅").then(() => message.react("❌"));

    const filter = (reaction, user) => {
      return (
        ["✅", "❌"].includes(reaction.emoji.name) &&
        user.id === interaction.options.get("usuario").user.id
      );
    };
    message
      .awaitReactions({ filter, max: 1, time: 3000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "✅")
          message.reply("https://tenor.com/35RL.gif");
        else message.reply("https://tenor.com/bmMqX.gif");
      })
      .catch((collected) => {
        console.log(collected.size);
      });
  },
};
