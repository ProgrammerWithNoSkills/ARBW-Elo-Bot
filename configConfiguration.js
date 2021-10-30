const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

for (const folder of guildConfigsFolder) {
    //readdirSync returns array of filenames in directory
    const guildConfigsFolder = fs.readdirSync(`./guildConfigs/${file}`).filter(file => file.endsWith('.json'));
    for (const file of guildConfigsFolder) {
        if (file.endsWith('.json')) {
            var configs = require(`./guildConfigs/${file}`);
        };
    };
};

module.exports = {
    async execute(message) {
        if (message.guild.id !== config.guildID) {
            let correctConfig = message.guild.id;
            // Take the correct file and paste it as config.json, overwriting old file
            fs.copyFile(`./guildConfigs/${correctConfig}.json`, `./config.json`, (err) => {
                if (err)
                    throw err;
                console.log('file copied');
            });
        } else {
            return;
        }
    }
};
