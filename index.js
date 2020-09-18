const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./config.json");
const cmdList = require("./data/commands.json");
const commands = require("./data/commands.js");

const recentlyCalled = new Set();

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
  console.log("Done loading v4");
});

bot.on("message", async message => {
  if (message.author.bot || !message.guild || message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

  let args = message.content.slice(config.prefix.length).trim().split(' ');
  let cmd = args.shift();

  let d = new Date();
  console.log(
    `[${d.getDay()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] User ${message.author.tag} sent a request for "${cmd}" with "${args}" arguments.`
  );

  if (cmd != null || cmd != "") {
    checkCommand(cmd, message, args);
  } else {
    console.log("Problema con comando");
  }
});

const checkCommand = async (cmd, msg, args = "") => {
  try {
    let command = cmdList.find(cm => cm.name === cmd) != null ? cmdList.find(cm => cm.name === cmd) : cmdList.find(cm => cm.short === cmd);
    if (command === undefined) { return }

    if (!recentlyCalled.has(`${msg.author.id}:${command.name}:${command.short}`)) {
      recentlyCalled.add(`${msg.author.id}:${command.name}:${command.short}`);
      let response = await commands[command.name](msg, args);
    } else {
      let cd = command.cooldown / 1000;
      msg.channel.send(`Tenes que esperar ${cd}s antes de usar ese comando de nuevo.`)
    }
    setTimeout(() => {
      recentlyCalled.delete(`${msg.author.id}:${command.name}:${command.short}`);
    }, command.cooldown);
    return true;
  }
  catch (err) { console.log(err); }
}