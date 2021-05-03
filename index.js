const Discord = require("discord.js");
const bot = new Discord.Client();

const SQLite3 = require('better-sqlite3');
const sql = new SQLite3('./db/player_data.sqlite')

const config = require("./config.json");
const cmdList = require("./data/commands.json");
const commands = require("./scripts/commands.js");

const chalk = require("chalk");
const error = chalk.bold.red;
const warning = chalk.hex('#FFA500');
const success = chalk.bold.green;

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

  const userTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'player_data';").get();

  if (!userTable['count(*)']) {
    sql.prepare("CREATE TABLE player_data (id TEXT PRIMARY KEY, wallet TEXT, inv TEXT, pet TEXT, stats TEXT);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON player_data (id);").run();
    sql.pragma("synchronous = 1"); sql.pragma("journal_mode = wal");
  }

  bot.getData = sql.prepare("SELECT * FROM player_data WHERE id = ?");
  bot.setData = sql.prepare("INSERT OR REPLACE INTO player_data (id, wallet, inv, pet, stats) VALUES (@id, @wallet, @inv, @pet, @stats);");
  console.log(chalk.gray("Cargadas las tablas de DB"))

  console.log(chalk.blue(
    'db   dD d888888b db      d888888b d888888b d8888b.  .d88b.  d888888b\n' +
    '88 ,8P     88    88       ~~88~~     88    88   8D .8P  Y8.  ~~88~~\n' +
    '88,8P      88    88         88       88    88oooY  88    88    88\n' +
    '88 8b      88    88         88       88    88~~~b. 88    88    88\n' +
    '88  88.   .88.   88booo.    88      .88.   88   8D  8b  d8     88\n' +
    'YP   YD Y888888P Y88888P    YP    Y888888P Y8888P    Y88P      YP'));
  console.log(success(`Cargado KiltiBot v5, Peepo Edition!`));
});

bot.on("message", async message => {
  if (message.author.bot || !message.guild || message.content.toLowerCase().indexOf(config.prefix) !== 0) return;

  if (message.guild) {
    table = bot.getData.get(message.author.id);

    if (!table) {
      table = {
        id: `${message.author.id}`,
        wallet: encodeURI(JSON.stringify({
          coins: 50,
          costumeToken: 0
        })),
        inv: encodeURI(JSON.stringify([])),
        pet: encodeURI(JSON.stringify({
          name: "Peepo",
          level: 1,
          cxp: 0,
          mxp: 10,
          thirst: 0,
          hunger: 0,
          growth: 0,
          hp: 10,
          mhp: 10,
          happy: 50,
          daily: '0000',
          costume: null
        })),
        status: encodeURI(JSON.stringify({
          paseos: 0,
          dineroTotal: 0,
          tokensTotal: 0
        }))
      }
    }

    if (table.mxp === 0) { table.mxp = 10 }

    bot.setData.run(table)
  }

  let args = message.content.slice(config.prefix.length).trim().split(/ (?=(?:(?:[^"']*"){2})*[^"']*$)/);
  let cmd = args.shift();

  let d = new Date();
  console.log(`[${d.getDay()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] User ${message.author.tag} sent a request for "${cmd}" with "${args}" arguments.`);

  const kiltyList = ['kilti', 'keilty', 'kilty', 'keilti']

  for (let i = 0; i < kiltyList.length; i++) {
    if (message.toString().toLowerCase() == kiltyList[i]) {
      console.log(kiltyList[i]);
      message.react(
        "<:cc:426195792081190932>"
      )
    }
  }

  if (cmd != null) {
    checkCommand(cmd, message, args);
  }
  else {
    console.log("Problema con comando");
  }
});

const checkCommand = async (cmd, msg, args = "") => {
  try {
    let command = cmdList.find(cm => cm.name === cmd) != null ? cmdList.find(cm => cm.name === cmd) : cmdList.find(cm => cm.short === cmd);
    if (command === undefined) { msg.channel.send('Ese comando no existe.'); return }

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