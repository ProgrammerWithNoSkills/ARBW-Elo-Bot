const config = require('../../config.json'); //config file

const prefix = config.prefix; //prefix from config file

//functions
const updateDB = require(`./scoreFunctions/updateSelectedGameData.js`) //update database function
const utilEmbed = require('../archive/utilEmbed.js'); //utility embed generator

module.exports = {
	name: 'score',
	description: 'score games',
	args: true,
	usage: '<gameID> <winningTeam(1/2)> <MVP1> <MVP2(optional)> <MVP3(optional)>',
	cooldown: 5,
	aliases: ['scr'],
	permissions: '',
	async execute(message, args, UserDB, GamesDB, command) {

			//check if player is a scorer
			if (!message.member.roles.cache.has(config.roleIDs[`Scorer`])) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `Whoa there <@${message.member.id}>, **you are not a Scorer!** Only Scorers can use \`=score\`!`);
				return message.channel.send({embed: embed});
			};

			//get given game id from args
			const gameID = args[0].replace(/[#]/g, '');

			const winningTeam = args[1].trim();
			//check if winningTeam is valid
			if (winningTeam != 1 && winningTeam != 2) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `Look here <@${message.member.id}>, you did not specify a valid winning team! Winning team has to be either \`1\` or \`2\`.`);
				return message.channel.send({embed: embed});
			};

			//check if there are MVP provided
			if (!args[2]) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, please specify at least one MVP!`);
				return message.channel.send({embed: embed});
			};

			//extract game from database
			const selectedGameData = await GamesDB.findOne( { where: { id: gameID } } );

			//check if game was aborted
			const aborted = selectedGameData.t1P1Delta;
			if (aborted === `ABORTED`) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `:no_entry: | Aborted Game`, `**Listen up** <@${message.member.id}>, that game was aborted and cannot be scored!`);
				return message.channel.send({embed: embed});
			};

			//check if game has already been scored
			const scoredStatus = selectedGameData.scored;
			if (scoredStatus) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `:no_entry: | Game Already Scored`, `**Listen up** <@${message.member.id}>, that game has already been scored!`);
				return message.channel.send({embed: embed});
			};

			//check if game is voided
			const voided = selectedGameData.isVoided;
			if (voided) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `:no_entry: | Voided`, `**Oops** <@${message.member.id}>, that game has been marked as void!`);
				return message.channel.send({embed: embed});
			};

//update database
/*=======================================================*/
			const gameDBUpdate = await updateDB.updateSelectedGameData(message, args, UserDB, selectedGameData, winningTeam);
/*=======================================================*/

			return;

	},
};
