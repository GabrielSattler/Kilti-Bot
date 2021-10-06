const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("votekilti")
    .setDescription("Vote kiltea a un pete")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a vote kiltear")
        .setRequired(true)
    ),
  async execute(interaction) {
    const embed = new Discord.MessageEmbed()
      .setColor(0xffff00)
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${
          interaction.options.get("usuario").user.id
        }/a_${interaction.options.get("usuario").user.avatar}.png`
      )
      .setTitle(`VOTEKILTI`)
      .addField(
        `Si ${
          interaction.options.get("usuario").user.username
        } tiene el pito chico vota ✅`,
        `jaja meme`,
        false
      );

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
    message.react("✅");

    const filter = (reaction, user) => {
      return (
        ["✅"].includes(reaction.emoji.name) && user.id !== message.author.id
      );
    };
    message
      .awaitReactions({ filter, max: 3, time: 30000, errors: ["time"] })
      .then(() => {
        message.reply("https://i.imgur.com/RjInJnv.png");
      })
      .catch((collected) => {
        console.log(collected.size);
      });
  },
};
