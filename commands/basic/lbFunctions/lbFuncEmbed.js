const Discord = require('discord.js');

module.exports = {
	//EmbedGenerate
	/*======================================================================*/
	async leaderboardGenerator(message, arg, lbArrComplete) {

		let lbColor = `#5A03F8`;
		switch (arg) {
			case `elo`:
			 	lbColor = `0xf91010`;
				break;
			case `mvp`:
				lbColor = `#7C13BA`;
				break;
			case `gamesPlayed`:
				lbColor  = `#41C760`;
		};

		try {
			var LeaderboardEmbed = new Discord.MessageEmbed()
			.setColor(lbColor)
			.setTitle('**Asian Ranked Bedwars Leaderboard**')
			.setDescription(`炫耀你的技能 \nFlex your skills and dedication`)
			.addFields(
			//	{ name: 'Rank', value: 'Some value here', inline: true },
			{ name: '\u200B', value: lbArrComplete, inline: true }
			)
			.setTimestamp()
			.setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982', `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`);
		return LeaderboardEmbed;

		} catch (e) {
				console.log(e)
				return message.reply(`Maybe there's no data to give.`);
		}
	},
};
