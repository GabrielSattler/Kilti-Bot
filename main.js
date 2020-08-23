const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('./config.json');
const cmdList = require('./data/commands.json');
const commands = require('./data/commands.js');

bot.login(config.token);

bot.on('ready', () => {
  console.log("Done loading.");
});

bot.on('message', message => {
    if (message.author.bot || !message.guild || message.content.indexOf(config.prefix) !== 0) return;
  
    let cmd = message.content.slice(config.prefix.length).trim().split(/ +/g);
  
    if(!checkCommand(cmd[0], message)){
      message.channel.send(`That command does not exist, please type _${config.prefix} help_ to see the command list`);
    }
});

const checkCommand = async (cmd, msg, args = "") => {
    try{
      if(cmd == null || cmd == "")
        return false;
      else if (!cmdList.find(x => x.name === cmd) && !cmdList.find(x => x.short === cmd))
      {
        return false;
      }
      else
      {
        for(let i = 0; cmdList.length; i++){
          if(cmdList[i].name == cmd || cmdList[i].short == cmd){
            let response = await commands[cmdList[i].name](msg, args)
  
            return true;
          }
        }
  
        return false;
      }  
    } catch(err){
      console.log(err);
    }
}