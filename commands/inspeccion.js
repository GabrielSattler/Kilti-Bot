const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inspeccion")
    .setDescription("A ver la tula compañero")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a checkear")
        .setRequired(false)
    ),
  async execute(interaction) {
    let com, tula, user, aURL;
    user = interaction.user.username;

    if (interaction.options.get("usuario") != undefined) {
      tula = interaction.options.get("usuario").user.tag.split("#")[1] / 100;
      aURL = `https://cdn.discordapp.com/avatars/${interaction.options.get("usuario").user.id}/a_${interaction.options.get("usuario").user.avatar}.png`;
    } else {
      tula = interaction.user.tag.split("#")[1] / 100;
      aURL = `https://cdn.discordapp.com/avatars/${interaction.user.id}/a_${interaction.user.avatar}.png`;
    }

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
      .setTitle(`Tamaño de la pinga de ${interaction.user.username}`)
      .setThumbnail(aURL)
      .addField(tula.toFixed(2) + "cm", com, false);

    return interaction.reply({ embeds: [embed] });
  },
};
