const fs = require('fs');
const config = require('../../config.json');
const Fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config()

module.exports = {

    name: 'register',
    description: 'Register with =register [space] your_ign!',
    args: true,
    usage: '<ign>',
    aliases: ['reg', 'r'],
    cooldown: 10,

//function
/*==================================================================*/
    async execute(message, args, UserDB) {
        if (await message.member.roles.cache.some(role => role.id === config.Unregistered)) {

            const registeeID = message.member.id;
            const ignGiven = args[0];
            const person = message.member;

            function Error(message, content, unmetCondition) {
            let embed = new Discord.MessageEmbed()
            .setTitle('🚫 | An Error Occurred!')
            .setDescription('**' + content + '**' + (unmetCondition ? '\n\n**Unmet Precondition:** `' + unmetCondition + '`' : ''))
            .setColor(`RED`)

            return message.channel.send({ embed: embed})
            };

            async function Success(message, content) {
            let embed = new Discord.MessageEmbed()
            .setTitle(':white_check_mark:  | Successfully Registered!')
            .setDescription('**' + content + '**' )
            .setColor(`GREEN`)

            return message.channel.send({ embed: embed})
            };
            // Define hypixel token, you need it.
            const hypixelToken = process.env.HYPIXEL_API_TOKEN;

            /*
            // Mojang checks - checks if the user exists
            let uuid;

            const fetchMojang = await Fetch(`https://api.mojang.com/users/profiles/minecraft/${ignGiven}`);
            const texted = await fetchMojang.text();

            if(!texted) return Error(message, 'Please provide a valid username. That username does not exist.', 'INVALID_USERNAME')

            const mojangJson = await JSON.parse(texted);

            uuid = mojangJson.id

            const Hypixel = await Fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${hypixelToken}`)
                        .then((res) => res.json())

            if(Hypixel.success === false) return Error(message, 'The player you provided has never logged onto Hypixel!')
            // Other possibility is because API token is fucked but whatever

            if(!Hypixel.player.socialMedia || !Hypixel.player.socialMedia.links || !Hypixel.player.socialMedia.links.DISCORD) {
            return Error(message, 'The player you provided has never linked their Discord account!\nPlease link your account in your Hypixel profile!', 'ACCOUNT_ISNT_LINKED');
            };

            let hypixelLinkedDiscord = Hypixel.player.socialMedia.links.DISCORD;

            if(hypixelLinkedDiscord !== message.author.tag) return Error(message, 'That account is not yours!\nIt is linked to `' + hypixelLinkedDiscord + '`\n( You are ' + message.author.tag + ' )');
            */

            //discord code
            await Success(message, `You have successfully registered as ${ignGiven}!`)
            await person.roles.add(config.Registered);
            await person.roles.add(config.eloWinLoss[`zero`].role);
            await person.roles.remove(config.Unregistered);
            await person.setNickname(`[${0}] ${ignGiven}`);

            //database code
            try {
                //create new entry in database
                const tag = await UserDB.create({
                    userid: registeeID,
                    ign: ignGiven,
                    elo: 0,
                    });
                    return console.log(`User ${tag.ign} registered.`);
            }
            catch (e) {
                 if (e.name === 'SequelizeUniqueConstraintError') {
                       return message.reply('That username already exists. If you think this is a mistake, please contact staff.');
                      }
                  console.error(e);
                  return message.reply('Something went wrong with adding you to the database. Please contact staff.');
            }

        } else if (message.member.roles.cache.some(r => r.id === config.Registered)) {
            message.reply(`You have already registered.`);
        } else { //user does not have Registered or Unregistered role.
            console.log(config.botToken);
            console.log(config.hypixelAPIToken);
            console.log(config.Unregistered);
            console.log(config.Registered);
            message.reply(`You do not have the Registered or Unregistered role. Please contact staff.`);
        }
    },
};
