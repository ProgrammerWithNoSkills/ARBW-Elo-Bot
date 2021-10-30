//dependencies
const fs = require('fs'); //Node.js native file system module
const Discord = require('discord.js'); //discord js api
const dataBases = require(`./dbInitialise`); //database initialiser
const fetch = require('node-fetch'); //dependency to fetch apis
const config = require('./config.json'); //config file
const prefix = config.prefix; //prefix from config file
require('dotenv').config() //dotenv for env vars

const client = new Discord.Client(); //initialise client

const utilEmbed = require('./commands/archive/utilEmbed.js');

const messageScript = require('./events/message.js');

//SQL Datastructure ----- see dbInitialise.js
/*======================================================================*/

//users database handler
const userSequelize = dataBases.initUserSequelize();

//games database handler
const gamesSequelize = dataBases.initGamesSequelize();

//users database structure
var UserDB = dataBases.initUserDB(userSequelize);

//games database structure
var GamesDB = dataBases.initGamesDB(gamesSequelize);

exports.databases = {
    userDB: UserDB,
    gamesDB: GamesDB
}
/*======================================================================*/

//Load events.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Event ${eventName} loaded.`);
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandFolders = fs.readdirSync(`./commands`);

for (const folder of commandFolders) {
    //readdirSync returns array of filenames in directory
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        if (file.endsWith('.js')) {
            var commande = require(`./commands/${folder}/${file}`);
        };
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        client.commands.set(commande.name, commande);
        if (commande.aliases) {
            commande.aliases.forEach(alias => {
                client.aliases.set(alias, commande.name);
            });
        }
    };
};


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
    UserDB.sync({ alter: true });
    console.log(`User Database Synced!`);
    GamesDB.sync({ alter: true });
    console.log(`Games Database Synced!`);
    client.user.setStatus(`online`);
    client.user.setActivity(`${prefix}help`, { type: "WATCHING" });
});

//Login Token
client.login(process.env.BOT_TOKEN);