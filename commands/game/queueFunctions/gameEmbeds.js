const Discord = require('discord.js'); //discord js api
const config = require('../../../config.json');

module.exports = {
	async miscEmbed(content) {
		try {
			let MiscEmbedObject = new Discord.MessageEmbed()
			.setColor(`#800000`)
			.setDescription(`${content}`)

			return MiscEmbedObject;
		} catch (e) {
			console.log(e)
			return message.reply(`Error generating miscEmbed. Please contact staff.`);
		};
	},

	async queuingEmbed(message, numOfPlayersInQueue) {

		let numOfQueue;

		if (numOfPlayersInQueue >= 8) {
			numOfQueue = `8** players in queue. New game starting...`;
		} else {
			numOfQueue = `${numOfPlayersInQueue}** players in the queue.`;
		};

		try {
      let QueuingEmbedObject = new Discord.MessageEmbed()
      .setColor(`#ffc0cb`)
      .setDescription(`**User <@${message.member.id}> is now queuing!**`, message.author.avatarURL())
      .addFields(
				{ name: `\u200B`, value: `There are now **${numOfQueue}`, inline: false },
				{ name: `\u200B`, value: `If the queue is full and you are not moved within 20 seconds, try leaving and rejoining queue!`, inline: false }
      )
      .setTimestamp()
      .setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982');

      return QueuingEmbedObject;

    } catch (e) {
        console.log(e)
        return message.reply(`Error generating Queuing embed. Please contact staff`);
    }
	},

	async generateGameStartEmbed(gameCaptains, gameID, gameTextChannel) {

    try {
      let GameStartEmbedObject = new Discord.MessageEmbed()
      .setColor(`#800000`)
      .setTitle(`**Asian Ranked Bedwars Game #${gameID[0].id}**`)
      .addFields(
				{ name: `Welcome to Asian Ranked Bedwars Game #${gameID[0].id}. Best of luck to all.\n*Your captains are:*`, value: `\u200B`, inline: false },
        { name: '\u200B', value: `**Team 1 Captain:** <@${gameCaptains[0].id}>\n**Team 2 Captain:** <@${gameCaptains[1].id}>`, inline: false },
  			{ name: '__**Choosing Teams**__', value: `Captains can pick their teams by doing \`=pick <@>\`. Please follow the prompts by the bot to do so.`
  			+ ` If you do not pick a player within 1 minute, one will be randomly picked for you.`, inline: false },
  			{ name: '__**Stopping the Game**__', value: `If for any reason a player must leave the game at`
  			+ ` this stage, they may type \`=breakgame\`. This will start a process to abort the game. \n\n**Please take note:**`
				+ ` If you leave the game voice channel before doing this, your roles will not be removed and you will not be able to requeue. \n\n`
  			+ `Should you think anyone did this unreasonably, to queue-dodge or otherwise, please contact staff.`
				+ ` If you abuse \`=breakgame\`, you are liable to be double-striked.`, inline: false },
				{ name: '__**Finishing a Game**__', value: `Once the game is over, someone should take a screenshot of the game ending screen,`
				+ ` with the MVPs amd who won visible. They should then upload it to this channel using \`=save <attach screenshot>\`.`
				+ ` Failure to do this will result in the game being void.`, inline: false},
      )
      .setTimestamp()
      .setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982', `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`);

      return GameStartEmbedObject;

    } catch (e) {
        console.log(e)
        return gameTextChannel.send(`Error generating Captain embed. Please contact staff`);
    }
	},

	async generateTeamsPickedEmbed(team1Arr, team2Arr, gameID, gameTextChannel) {

		try {
			let TeamsPickedEmbedObject = new Discord.MessageEmbed()
			.setColor(`#800000`)
			.setTitle(`**Asian Ranked Bedwars S[BETA] Game #${gameID} has started. **`)
			.setDescription(`*Best of luck to all. The teams are:*`)
			.addFields(
			{ name: '\u200B', value: `${team1Arr[0]}\n\n**__Captain__:**\n${team1Arr[1]}\n\n**__Players__:**\n${team1Arr[2]}\n${team1Arr[3]}\n${team1Arr[4]}`, inline: true },
			{ name: '\u200B', value: `${team2Arr[0]}\n\n**__Captain__:**\n${team2Arr[1]}\n\n**__Players__:**\n${team2Arr[2]}\n${team2Arr[3]}\n${team2Arr[4]}`, inline: true },
			{ name: '\u200B', value: `You will be moved to your team calls shortly. Please wait for this to happen.`
			+ `\n\nIf you so wish, you may then leave the team call and move to a public call to stream.`, inline: false },
			)
			.setTimestamp()
			.setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982', `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`);
			return TeamsPickedEmbedObject;

		} catch (e) {
				console.log(e)
				return gameTextChannel.send(`Error generating Teams Picked embed. Please contact staff`);
		}
	},

	async generateBreakGameEmbed(gameTextChannel, user) {
		try {
			console.log(user);
			let GameBreakEmbedObject = new Discord.MessageEmbed()
			.setColor(`BLACK`)
			.setTitle(`**Abort Game Poll**`)
			.setDescription(`*Initiated by:* <@${user.id}>`, user.user.avatarURL())
			.addFields(
			{ name: '\u200B', value: `If you would like to abort this game, please vote with :white_check_mark:, else, react with :octagonal_sign:`, inline: false },
			{ name: '\u200B', value: `Vote with :white_check_mark: if:\n**a)** *A player has left the game.*`
			+ `\n**b)** *A player or players need to leave, and everyone agrees that they can.*`
			+ `\n**c)** *Any other reason you think is reasonable.*`, inline: false },
			{ name: '\u200B', value: `5 people are needed to vote for either option to continue. You have one mintue to vote.`}
			)
			.setTimestamp()
			.setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982');
			return GameBreakEmbedObject;

		} catch (e) {
				console.log(e)
				return gameTextChannel.send(`Error generating BreakGame embed. Please contact staff`);
		};
	},

	async generateGameAbortedEmbed(gameTextChannel, gameID) {
		try {
			let GameAbortEmbedObject = new Discord.MessageEmbed()
			.setColor(`BLACK`)
			.setTitle(`:exclamation: | **Game Abort Successful!**`)
			.setDescription(`**Game #${gameID} will now be automatically aborted.**`)
			.addFields(
			{ name: '\u200B', value: `Please do not leave the voice channel until it is deleted, or your roles may not be removed.`, inline: false },
			{ name: '\u200B', value: `Once you have been removed from the voice channel, you may then requeue or log off at your own leisure.`, inline: false },
			{ name: '\u200B', value: `**Clearing your roles now...`, inline: false },
			)
			.setTimestamp()
			.setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982');
			return GameAbortEmbedObject;

		} catch (e) {
				console.log(e)
				return gameTextChannel.send(`Error generating Game Abort embed. Please contact staff`);
		};
	},

	async generateCaptinPickEmbed(color, teamNum, captain, playerPoolIDs) {
		try {
			let PlayerListEmbedObject = new Discord.MessageEmbed()
			.setColor(color)
			.setAuthor(`Team ${teamNum} Captain, pick a player to be on your team!`, captain.user.avatarURL())
			.addFields(
				{ name: '__**Avalible Players**__', value: playerPoolIDs, inline: true },
			)
			.setTimestamp()
			return PlayerListEmbedObject;

		} catch (e) {
				console.log(e)
				return gameTextChannel.send(`Error generating Team Picking List embed. Please contact staff`);
		};
	},

};
