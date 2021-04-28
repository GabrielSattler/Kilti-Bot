const Discord = require('discord.js');

const SQLite3 = require('better-sqlite3');
const sql = new SQLite3('./db/player_data.sqlite');

const data = require('../data/peepogotchi.json');
const items = require('../data/itemList.json');
const costumes = require('../data/costumes.json');

const Random = async (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
}

const getData = async id => {
  const table = await sql.prepare("SELECT * FROM player_data WHERE id = ?").get(id);

  let walletData = await JSON.parse(decodeURI(table.wallet));
  let invData = table.inv != '' ? await JSON.parse(decodeURI(table.inv)) : '';
  let petData = await JSON.parse(decodeURI(table.pet));

  console.log(table)

  let response = {
    id: table.id,
    wallet: walletData,
    inv: invData,
    pet: petData
  }

  return response;
}

const setData = async (data) => {
  data.wallet = encodeURI(JSON.stringify(data.wallet));
  data.inv = encodeURI(JSON.stringify(data.inv));
  data.pet = encodeURI(JSON.stringify(data.pet));

  let table = {
    id: data.id,
    wallet: data.wallet,
    inv: data.inv,
    pet: data.pet
  }

  sql.prepare("INSERT OR REPLACE INTO player_data (id, wallet, inv, pet) VALUES (@id, @wallet, @inv, @pet);").run(table)

  return true;
}

const setStats = async (id, thirst = 0, hunger = 0, growth = 0, health = 0, happy = 0, xp = 0) => {
  const table = await getData(id);

  if (!table) { return; }

  console.log(table.pet)

  if (happy != 0) {
    table.pet.happy += happy;
    if (table.pet.happy < 0) { table.pet.happy = 0; };
    if (table.pet.happy > 100) { table.pet.happy = 100; };
  }

  if (thirst != 0) {
    table.pet.thirst += thirst;

    if (table.pet.thirst < 0) { table.pet.thirst = 0 };
    if (table.pet.thirst > 100) { table.pet.thirst = 100 }; // Agregar penalización
  }

  if (hunger != 0) {
    table.pet.hunger += hunger;

    if (table.pet.hunger < 0) { table.pet.hunger = 0 };
    if (table.pet.hunger > 100) { table.pet.hunger = 100 }; // Agregar penalización
  }

  if (growth != 0) {
    table.pet.growth += growth * ((table.pet.happy * .01) * 2);
    if (gtable[1].rowth > 100) { table.pet.growth = 100 }; // Agregar penalización
  }

  if (health != 0) {
    table.pet.health += health;
    if (table.pet.health < 0) { table.pet.health = 0; };
    if (table.pet.health > 100) { table.pet.health = table.pet.mhp; }; //Agregar penalización
  }

  if (xp != 0) {
    table.pet.cxp += xp;
    if (table.pet.cxp >= table.pet.mxp) {
      table.pet.cxp -= table.pet.mxp;
      table.pet.mxp = table.pet.mxp * (table.pet.level * 1.25);
      table.pet.level++;
    };
    if (table.pet.cxp < 0) { table.pet.cxp = 0 };
  }

  if (await setData(table)) { return true; };
}

const SetCostume = async (msg, skin, rarity) => {
  const table = await getData(msg.author.id);

  let i = costumes[rarity].find(x => x.name == skin);

  table.pet.costume = i.url;

  setData(table);
}

const adoptar = async (msg, args) => {
  if (args.length < 1 && args[0].toString() === '' || args === null) { msg.channel.send(`No pusiste un nombre aceptable, proba _k nombrar <nombre>_`); return; }

  const table = await getData(msg.author.id);

  if (!table) { return; }

  table.pet.name = args[0].toString();

  await setData(table);
  msg.channel.send(`${msg.author.username}, tu peepo ahora se llama ${args[0].toString()}`)
}

const peepo = async msg => {
  const table = await getData(msg.author.id);

  if (!table) { return; }
  if (table.pet.name === "Unnamed") { msg.channel.send(`${msg.author.username}, primero tenes que darle un nombre a tu peepo con _k nombrar <nombre>_.`); return; }

  let pfp = table.pet.costume === null ? 'https://i.imgur.com/Zo5bgcI.png' : table.pet.costume;

  const embed = new Discord.MessageEmbed()
    .setTitle(`${table.pet.name}, el peepo de ${msg.author.username}`)
    .setThumbnail(`${pfp}`)
    .addFields(
      { name: `Billetera:`, value: `$${table.wallet.coins}`, inline: true },
      { name: `Tokens para disfraces`, value: `${table.wallet.costumeToken}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `💖 Vida`, value: `${table.pet.hp}/${table.pet.mhp}`, inline: true },
      { name: `🙂 Felicidad`, value: `${table.pet.happy}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `🍼 Crecimiento`, value: `${table.pet.growth}%`, inline: true },
      { name: `🌀 Lv ${table.pet.level}`, value: `${table.pet.cxp}/${table.pet.mxp}xp`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `🍖 Hambre`, value: `${table.pet.hunger}%`, inline: true },
      { name: `🥛 Sed`, value: `${table.pet.thirst}%`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true }
    )

  msg.channel.send({ embed });
}

const paseo = async msg => {
  const table = await getData(msg.author.id);

  if (!table) { return; }
  if (table.pet.name === "Unnamed") { msg.channel.send(`${msg.author.username}, primero tenes que darle un nombre a tu peepo con _k nombrar <nombre>_.`); return; }

  let roll = await Random(0, data.paseo.length - 1);
  const paseo = data.paseo[roll];

  let tokenChance = 5;
  let tokenRoll = Random(0, 100);

  if (tokenRoll <= tokenChance) {
    table.wallet.costumeToken++;

  }

  let res = await setStats(msg.author.id, paseo.thirst, paseo.hunger, 0, 0, paseo.happy, paseo.xp);

  const embed = new Discord.MessageEmbed()
    .setTitle(`${msg.author.username} sale de paseo con ${table.pet.name}`)
    .setDescription(`${paseo.desc}`)
    .addFields(
      { name: `🙂 Felicidad`, value: `${paseo.happy}`, inline: true },
      { name: `🌀 EXP`, value: `${paseo.xp}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true },
      { name: `🍖 Hambre`, value: `${paseo.hunger}`, inline: true },
      { name: `🥛 Sed`, value: `${paseo.thirst}`, inline: true },
      { name: `\u200b`, value: `\u200b`, inline: true }
    )

  msg.channel.send(embed);

  if (!res) { console.log(`Error saving data for ${msg.author.tag}`) }
}

const daily = async msg => {
  const table = await getData(msg.author.id);

  if (!table) { return; }

  let fecha = new Date();
  fecha = `${fecha.getDate()}`

  if (table.pet.daily == fecha) {
    msg.channel.send(`${msg.author.username}, ya reclamaste tu pago diario de hoy.`);
    return;
  }

  let gold = await Random(50, 150);
  table.wallet.coins += gold;
  table.pet.daily = `${fecha}`;

  setData(table);

  msg.channel.send(`${msg.author.username} reclamo su pago diario y recibio $${gold}`)
}

const shop = async (msg, args) => {
  args[0] = args[0] != null ? args[0].toLowerCase() : null;

  let list = [];

  if (args == '' || args.length == 0) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Mercado')
      .setColor('0x00ff00')
      .addFields(
        { name: 'Comida', value: 'k shop food', inline: false },
        { name: 'Bebidas', value: 'k shop drinks', inline: false },
        { name: 'Disfraces', value: 'k shop costumes', inline: false }
      )

    msg.channel.send(embed);
  }
  else if (args[0] === 'food') {

    for (let key in items.Food) {
      let item = items.Food[key];
      list.push({ name: `${item.emoji} ${item.name}`, value: `Costo: $${item.buyCost}`, inline: false })
    }

    let embed = new Discord.MessageEmbed()
      .setTitle('Mercado de Comida')
      .setColor('0x00ff00')
      .addFields(list)

    msg.channel.send(embed);
    return;
  }
  else if (args[0] === 'drinks') {

    for (let key in items.Drink) {
      let item = items.Drink[key];
      list.push({ name: `${item.emoji} ${item.name}`, value: `Costo: $${item.buyCost}`, inline: false })
    }

    let embed = new Discord.MessageEmbed()
      .setTitle('Mercado de Drinks')
      .setColor('0x00ff00')
      .addFields(list)

    msg.channel.send(embed);

    return;
  }
}

const buy = async (msg, item) => {
  if (item == '' || item.length < 1) {
    msg.channel.send(`${msg.author.username}, no me dijiste que item queres comprar, nabo.`)
    return;
  }

  console.log(item)

  let table = await getData(msg.author.id);

  let boughtItem;
  let name;
  let tipo = 'Food';
  let quantity = isNaN(item[1]) ? 1 : item[1];

  if (!quantity < 0 || quantity == null) { quantity = 1; }

  if (item[0] != null || item[0] != '') {
    name = await item[0]
      .replace('"', '')
      .replace('"', '')
      .toLowerCase();
  }

  boughtItem = items.Food[name];

  if (boughtItem == null) {
    boughtItem = items.Drink[name];
    tipo = 'Drink';
  }

  if (boughtItem == null) { msg.channel.send(`Ese item no existe.`); return; }

  if (table.wallet.coins >= boughtItem.buyCost * quantity) {

    table = await AddItem(msg.author.id, boughtItem, quantity, tipo, boughtItem.rarity);

    table.wallet.coins -= boughtItem.buyCost * quantity;

    setData(table)

    msg.channel.send(`Compraste ${boughtItem.emoji} **${boughtItem.name}** x${quantity} por $${boughtItem.buyCost}`)
  }
  else {
    msg.channel.send(`No tienes suficientes monedas para comprar ese objeto.`)
  }
}

const AddItem = async (playerid, item, stacks, tipo, Rarity) => {
  let table = await getData(playerid);
  let foundItem = table.inv.find(x => x.name == item.name);

  if (foundItem && foundItem.stacks > 0) {
    foundItem.stacks += parseInt(stacks);
  } else {
    table.inv.push({ name: item.name, stacks: parseInt(stacks), rarity: Rarity, type: tipo })
  }

  return table;
}

const RemoveItem = async (playerid, stacks, item) => {
  let table = await getData(playerid);
  let foundItem = table.inv.find(x => x.name == item.name);

  console.log(foundItem);
  console.log(table.inv.indexOf(foundItem));

  if (foundItem) {
    if (foundItem.stacks > 1) {
      foundItem.stacks -= parseInt(stacks);
      setData(table);
      table
      return true;
    }
    else {
      table.inv.splice(table.inv.indexOf(foundItem), 1);
      setData(table);
      return true;
    }
  }
  else {
    return false;
  }
}

const GetItem = async (playerid, item) => {
  let table = await getData(playerid);
  let foundItem = table.inv.find(x => x.name.toLowerCase() == item);

  if (foundItem != null && foundItem.stacks > 0) {
    return foundItem;
  }
  else {
    return false;
  }
}

const viewInv = async (msg, page = 0) => {
  let table = await getData(msg.author.id);

  if (!table) { return; }

  let itemList = [];
  let desc = '';

  for (let i = 0; i < table.inv.length; i++) {
    console.log(table.inv[i]);
    if (table.inv[i].type == 'Food') { desc = `Recupera 🍖${items.Food[table.inv[i].name.toLowerCase()].hunger}` }
    if (table.inv[i].type == 'Drink') { desc = `Recupera 🥛${items.Drink[table.inv[i].name.toLowerCase()].thirst}` }
    if (table.inv[i].type == 'Costume') { desc = `Disfraz` }
    itemList.push({ name: `${table.inv[i].name} x${table.inv[i].stacks}`, value: desc, inline: false })
  }

  if (itemList.length == []) {
    itemList.push({ name: `Telarañas`, value: `Tu inventario esta vacio`, inline: false })
  }
  console.log(itemList)

  const embed = new Discord.MessageEmbed()
    .setTitle(`Inventario de ${msg.author.username}`)
    .addFields(itemList)

  msg.channel.send(embed);
}

const use = async (msg, item) => {
  let name;

  if (!table) { return; }

  if (item[0] != null || item[0] != '') {
    name = await item[0];
  }

  let found = await GetItem(msg.author.id, name.toLowerCase());

  if (found == false && item == "") {
    msg.channel.send(`${msg.author.username}, no seleccionaste un item para usar.`);
    return;
  }
  else if (found == false) {
    msg.channel.send(`${msg.author.username}, no tenes suficiente ${name}`);
    return;
  }

  console.log(found)

  switch (found.type) {
    case 'Food':
      item = items.Food[found.name.toLowerCase()];
      break;
    case 'Drink':
      item = items.Drink[found.name.toLowerCase()];
      break;
    case 'Costume':
      SetCostume(msg, found.name, found.rarity);
      return;
    default:
      console.log('Error con el tipo de item al querer buscarlo en la lista')
      break;
  }

  let thirst = item.thirst != null ? true : false;
  let hunger = item.hunger != null ? true : false;
  let growth = item.growth != null ? true : false;
  let health = item.health != null ? true : false;
  let happy = item.happy != null ? true : false;
  let xp = item.xp != null ? true : false;

  let res = await setStats(
    msg.author.id,
    item.thirst != 0 && item.thirst != null ? item.thirst : 0,
    item.hunger != 0 && item.hunger != null ? item.hunger : 0,
    item.growth != 0 && item.growth != null ? item.growth : 0,
    item.health != 0 && item.health != null ? item.health : 0,
    item.happy != 0 && item.happy != null ? item.happy : 0,
    item.xp != 0 && item.xp != null ? item.xp : 0
  );

  if (!RemoveItem(msg.author.id, 1, found)) {
    console.log("Error removiendo item");
    return;
  }

  let fields = [];

  if (thirst)
    fields.push({ name: `Sed`, value: `${item.thirst}`, inline: false })
  if (hunger)
    fields.push({ name: `Hambre`, value: `${item.hunger}`, inline: false })
  if (growth)
    fields.push({ name: `Crecimiento`, value: `${item.growth}`, inline: false })
  if (health)
    fields.push({ name: `Vida`, value: `${item.health}`, inline: false })
  if (happy)
    fields.push({ name: `Felicidad`, value: `${item.happy}`, inline: false })
  if (xp)
    fields.push({ name: `Experiencia`, value: `${item.xp}`, inline: false })

  let embed = new Discord.MessageEmbed()
    .setTitle(`Utilizaste x1 ${item.name}`)
    .setDescription(`Recuperaste:`)
    .addFields(
      fields != null ? fields : { name: '404', value: 'Item not found' }
    )
    .setColor('0x00ff00')

  msg.channel.send(embed);
}

const lootbox = async msg => {
  let table = await getData(msg.author.id);

  if (table == null) {
    return;
  }

  console.log(table)

  if (table.wallet.costumeToken > 0) {

    let roll = Random(0, 100);
    let rl;
    console.log(roll)
    let item;
    let rarity = 'common';

    if (roll > 80) {
      rl = await Random(0, costumes.uncommon.length)
      item = costumes.uncommon[rl]
      rarity = 'uncommon';
    }
    else {
      rl = await Random(0, costumes.common.length)
      item = costumes.common[rl]
    }

    console.log(item)

    if (item == undefined) {
      msg.channel.send("Error buscando el disfraz, intenta de nuevo.");
      return;
    }

    let table = await AddItem(msg.author.id, item, 1, 'Costume', rarity);

    table.wallet.costumeToken -= 1;

    setData(table);
  }
  else {
    msg.channel.send(`${msg.author.username}, no tienes suficientes tokens para abrir una caja.`)
  }
}

const log = async msg => {
  if (!msg.member.roles.cache.find(r => r.name === 'kiltidev')) { msg.channel.send(`Necesitas ser ***admin*** para usar ese comando.`); return; }

  let data = await getData(msg.author.id);
  let fecha = new Date();
  console.log(fecha.getDate());
  console.log(data);
}

module.exports = { adoptar, peepo, paseo, daily, log, shop, buy, viewInv, use, lootbox };