const utilEmbed = require('../archive/utilEmbed.js');
const Fetch = require('node-fetch');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
	name: 'rename',
	description: 'Rename yourself without resetting all your stats.',
	args: true,
    argLength: 1,
	usage: '<new IGN>',
	cooldown: 5,
	aliases: ['rnm', 're'],
	permissions: '',
	async execute(message, args, UserDB) {

        //variable extraction
        const newIGN = args[0];
	    	const currentIGN = message.member.displayName.split(` `)[1];
        /*const verifyID = args[1].replace(/[<!>@]/g, '');
        const newIGN = args[2];*/

        //get message author actual id
        //const currentID = message.member.id.replace(/[<!>@]/g, '');

        //match id given to the actual user id
    /*  if (currentID != verifyID) {
        return message.reply(`Why are you trying to rename someone else.`);
        }; */

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
				const hypixelToken = config.hypixelAPIToken;

        //get user info from database
        const player = await UserDB.findOne( { where: { userid: message.author.id } });

        if (player) {
        if (player > 1) {
            //more than one person with that ID
            return message.reply(`There was a fatal error in renaming yourself. Please contact staff.`);
        };

				// Mojang checks - checks if the user exists
				let uuid;

				const fetchMojang = await Fetch(`https://api.mojang.com/users/profiles/minecraft/${newIGN}`);
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

        /*if (player.ign != currentIGN) {
            //database IGN does not match the IGN given in args[0]
            return message.reply(`You did not type the IGN correctly. Please try again.`);
        };*/

        //update name in database
            try {

              const updated = await player.update( { ign: newIGN } );
              await message.member.setNickname(`[${player.elo}] ${player.ign}`);
              return message.channel.send({embed: await utilEmbed.genEmbed(true, `GREEN`, `Your name has been successfully changed from ${currentIGN} to ${player.ign}!`)});

	            } catch (e) {
                console.log(e);
                return message.reply(`An issue occured. Please contact staff.`);
            }
        }
        return message.reply(`you do not exist in the database. Have you registered?`);
	},
};
