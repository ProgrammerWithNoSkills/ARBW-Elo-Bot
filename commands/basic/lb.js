const Discord = require('discord.js');
const lbFuncGen = require('./lbFunctions/lbFuncGen.js');
const lbFuncEmbed = require('./lbFunctions/lbFuncEmbed');
const lbFuncWLR = require('./lbFunctions/lbFuncWLR.js');

module.exports = {
	name: 'lb',
	description: 'flex or get flexed on',
	args: true,
	usage: '<leaderboardType>',
	cooldown: 20,
	aliases: ['leaderboard', 'lboard'],
	permissions: [''],
	async execute(message, args, UserDB) {
		const arg = args[0];
		//extract from database
		const tagList = await lbFuncGen.extract(message, arg, UserDB);

		if (tagList === false) {
			return;
		}
		//parse into separate arrays
		const arr1 = await lbFuncGen.arrayPush(tagList, arg);
		const arr2 = await lbFuncGen.arrayPush2();
		const arrBeautify = await lbFuncGen.arrayPush3();

		var lbArrComplete = []

		for (var i = 0; i < arr1.length; i++) {
				lbArrComplete.push( `#${i+1}  **${arr1[i]}**   ${arrBeautify[i]}   *${arr2[i]}*`);
		}

//constructor
/*======================================================================*/
		const LeaderboardEmbed = await lbFuncEmbed.leaderboardGenerator(message, arg, lbArrComplete);
/*======================================================================*/
		return message.channel.send(LeaderboardEmbed);

	},
};
