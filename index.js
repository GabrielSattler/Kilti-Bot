const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./config.json");
const cmdList = require("./data/commands.json");
const commands = require("./data/commands.js");

bot.login(config.token);

bot.on("ready", () => {
  bot.user.setPresence({
    status: 'online',
    activity: {
      name: 'k ?',
      type: "STREAMING",
      url: "https://theuselessweb.com/"
    }
  })
  console.log("Done loading.");
});

bot.on("message", message => {
  if (
    message.author.bot ||
    !message.guild ||
    message.content.toLowerCase().indexOf(config.prefix) !== 0
  )
    return;

  let args = message.content.slice(config.prefix.length).trim().split("\\b");
  let cmd = args.shift();

  if (cmd != null || cmd != "") {
    checkCommand(cmd, message, args);
  } else {
    console.log("Problema con comando");
  }
});

const checkCommand = async (cmd, msg, args = "") => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};