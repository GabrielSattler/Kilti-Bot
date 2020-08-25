const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./config.json");
const cmdList = require("./data/commands.json");
const commands = require("./data/commands.js");

bot.login(config.token);

bot.on("ready", () => {
  console.log("Done loading.");
});

bot.on("message", message => {
  if (
    message.author.bot ||
    !message.guild ||
    message.content.toLowerCase().indexOf(config.prefix) !== 0
  )
    return;

  let cmd = message.content
    .toLowerCase()
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);

  if (!checkCommand(cmd[0], message)) {
    message.channel.send(
      `That command does not exist, please type _${config.prefix} help_ to see the command list`
    );
  }
});

const checkCommand = async (cmd, msg, args = "") => {
  try {
    if (cmd == null || cmd == "") return false;
    else if (
      !cmdList.find(x => x.name.toLowerCase() === cmd) &&
      !cmdList.find(x => x.short.toLowerCase() === cmd)
    ) {
      return false;
    } else {
      for (let i = 0; cmdList.length; i++) {
        if (
          cmdList[i].name.toLowerCase() == cmd ||
          cmdList[i].short.toLowerCase() == cmd
        ) {
          console.log(
            `User ${msg.author.username} sent a request for "${cmd}" with "${msg}" arguments.`
          );
          let response = await commands[cmdList[i].name](msg, args);
          return true;
        }
      }
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};