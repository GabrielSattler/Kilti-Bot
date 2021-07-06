const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./config.json");
const cmdList = require("./data/commands.json");
const commands = require("./scripts/commands.js");

const chalk = require("chalk");
const error = chalk.bold.red;
const warning = chalk.hex("#FFA500");
const success = chalk.bold.green;

const recentlyCalled = new Set();

bot.login(config.token);

bot.on("ready", () => {
  bot.user.setPresence({
    status: "online",
    activity: {
      name: "k ?",
      type: "STREAMING",
      url: "https://theuselessweb.com/",
    },
  });

  console.log(
    chalk.blue(
      "db   dD d888888b db      d888888b d888888b d8888b.  .d88b.  d888888b\n" +
        "88 ,8P     88    88         88       88    88   8D .8P  Y8.  ~~88~~\n" +
        "88,8P      88    88         88       88    88oooY  88    88    88\n" +
        "88 8b      88    88         88       88    88~~~b. 88    88    88\n" +
        "88  88.   .88.   88         88      .88.   88   8D  8b  d8     88\n" +
        "YP   YD Y888888P Y88888P    YP    Y888888P Y8888P    Y88P      YP"
    )
  );
  console.log(success(`Cargado KiltiBot v5, Peepo Edition!`));
});

bot.on("message", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    message.content.toLowerCase().indexOf(config.prefix) !== 0
  )
    return;

  let args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ (?=(?:(?:[^"']*"){2})*[^"']*$)/);
  let cmd = args.shift();

  let d = new Date();
  console.log(
    `[${d.getDay()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] User ${
      message.author.tag
    } sent a request for "${cmd}" with "${args}" arguments.`
  );

  const kiltyList = ["kilti", "keilty", "kilty", "keilti"];
  const quien = ["quien", "kien", "quien?", "kien?", "quiente"];
  const lmessage = message.toString().toLowerCase();

  for (let i = 0; i < kiltyList.length; i++) {
    if (lmessage == kiltyList[i]) {
      message.react("<:cc:426195792081190932>");
    }
  }

  for (let i = 0; i < quien.length; i++) {
    if (lmessage == quien[i]) {
      message.channel.send("Yo pregunte hijo de puta");
    }
  }

  if (cmd != null) {
    checkCommand(cmd, message, args);
  } else {
    console.log("Problema con comando");
  }
});

const checkCommand = async (cmd, msg, args = "") => {
  try {
    let command =
      cmdList.find((cm) => cm.name === cmd) != null
        ? cmdList.find((cm) => cm.name === cmd)
        : cmdList.find((cm) => cm.short === cmd);
    if (command === undefined) {
      return;
    }

    if (
      !recentlyCalled.has(`${msg.author.id}:${command.name}:${command.short}`)
    ) {
      recentlyCalled.add(`${msg.author.id}:${command.name}:${command.short}`);
      let response = await commands[command.name](msg, args);
    } else {
      let cd = command.cooldown / 1000;
      msg.channel.send(
        `Tenes que esperar ${cd}s antes de usar ese comando de nuevo.`
      );
    }
    setTimeout(() => {
      recentlyCalled.delete(
        `${msg.author.id}:${command.name}:${command.short}`
      );
    }, command.cooldown);
    return true;
  } catch (err) {
    console.log(err);
  }
};
