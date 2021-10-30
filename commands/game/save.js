const utilEmbed = require('../archive/utilEmbed.js');//embed generator
const Discord = require('discord.js');
const config = require('../../config.json');
const saveGameEmbeds = require('./saveGameFuncs/saveGameEmbeds.js');
const findFuncs = require('./queueFunctions/gens/findFuncs.js');

module.exports = {
	name: 'save',
	description: '',
	args: false,
	usage: '<screenshot>',
	cooldown: 5,
	aliases: ['s'],
	permissions: '',
	async execute(message, args, UserDB, GamesDB) {

    let attachment;
    let providedAsLink;

    try {

      //check if the command was used in a game channel
      if (!message.channel.name.startsWith(`game-`)) {
        return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
          false, `RED`, `The \`=save\` command can only be used in a game channel!`)}
        );
      };

      //check if message has link
      if (args[0]) {
        providedAsLink = true;
        if (!args[0].startsWith(`https://cdn.discordapp.com/attachments/`)) {
          return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
            false, `RED`, `Please attach the screenshot!`)}
          );
        };
      } else {
        providedAsLink = false;
      };

      //check if message has attachments
      if (message.attachments.size == 0 && providedAsLink == false) {
        return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
          false, `RED`, `Please attach the screenshot!`)}
        );
      };

      //check if message has more than one attachment
      if (message.attachments.size > 1) {
        return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
          false, `RED`, `Please attach only one screenshot!`)}
        );
      };
			
			let gameID = await message.channel.name.replace(/\D/g,'');

			const gameData = await GamesDB.findOne( { where: { id: gameID } } );

			if (gameData.saved == true) {
        return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
          false, `RED`, `Game ${gameID} has already been saved! Please wait for it to be scored.`)}
        );
      };

      //if provided as link, save link
      if (providedAsLink) {
				attachment = args[0];
      } else if (providedAsLink == false) { //if provided as attachment, save attachment
				attachment = await message.attachments.first().url;
      } else return message.channel.send(`Error. Please contact dev`);

			//send Embeds to logging and game channel
			await message.channel.send( { embed: await saveGameEmbeds.genFinishGameEmbed(message.member, gameID) } );

			const loggingChannel = await findFuncs.channelFind(message.member, config.channelIDs[`GameScreenshots`]);
			if (!loggingChannel) {
				return message.reply(`Could not find the logging channel. Please contact staff as this is a critical issue.`);
			};
			await loggingChannel.send( { embed: await saveGameEmbeds.genLogGameEmbed(message.member, gameID, attachment) } );

			//delete channels and remove roles

			for (let i = 1; i < 3; i++) {
				for (let j = 1; j < 5; j++) {
					let playerIDField = `team${i}Player${j}ID`;
					let playerID = gameData[`${playerIDField}`];

					let player = await findFuncs.findUserFromID(message.guild, playerID);

					if (!player) {
						return message.reply(`Could not find user <@${playerID}>. Have they left the server?`)
					};

					await player.roles.remove(config.roleIDs[`In Game`]);
					await player.roles.remove(config.roleIDs[`Captain`]);
				};
			};

			await gameData.update( { saved: true } );

			const pregameVC = await findFuncs.channelFind(message.member, `game-${gameID}-pickingteams`);
			const team1VC = await findFuncs.channelFind(message.member, `game-${gameID}-team1`);
			const team2VC = await findFuncs.channelFind(message.member, `game-${gameID}-team2`);
			if (pregameVC) {
				await pregameVC.delete();
			};
			if (team1VC) {
				await team1VC.delete();
			};
			if (team2VC) {
				await team2VC.delete();
			};

			await setTimeout(async () => {await message.channel.delete()}, 10000);

			return true;

    } catch (e) {
    	console.log(e)
      return message.channel.send( {content: `<@${message.author.id}>`, embed: await utilEmbed.genEmbed(
        false, `RED`, `Fatal error in save game. Please contact staff.`)}
      );
    };

	},
};
