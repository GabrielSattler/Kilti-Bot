const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const Random = require("../random.js");
const ff = require("../data/ff.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fanfi")
    .setDescription("Mira un segmento del Fanfic Oficial (TM)"),
  async execute(interaction) {
    let ffID = await Random(0, ff.length - 1);
    let fraseID = await Random(0, ff[ffID].length);

    let text = ff[ffID][fraseID].frase;

    let message = `**Geilty Fanfic** *Tomo ${ffID}:${fraseID}*\n> ${text}\n*By SofiaG#8600*`;

    interaction.reply(message);
  },
};
