const Discord = require('discord.js');
const Sequelize = require('sequelize'); //sqlite dependencies

module.exports = {
	name: 'suckyourdisck',
	description: 'view your profile and stats!',
	args: false,
	usage: '',
	cooldown: 60,
	aliases: [],
	permissions: '',
/*======================================================================*/
	async execute(message, args, UserDB, GamesDB) {
		try {
			var LeaderboardEmbed = new Discord.MessageEmbed()
				.setColor('#5A03F8')
				.setTitle('**Your stats**')
				.setDescription(`炫耀你的技能 \nFlex your skills and dedication`)
				.addFields(
					//inline patterns are based off the previous field
					//ignore the \`\`\`(for embeds)
					{ name: 'Game', value: `\`\`\`${player.elo}\`\`\``, inline: false },
					{ name: 'Scored', value: `\`\`\`${player.mvp}\`\`\``, inline: false },
					{ name: 'Voided', value: `\`\`\`${gamesPlayed}\`\`\``, inline: true },
					{ name: 'Winning Team', value: `\`\`\`${player.gamesWon}\`\`\``, inline: false },
					{ name: 'Loosing Team', value: `\`\`\`${player.gamesLost}\`\`\``, inline: false },
					{ name: 'Scored by', value: `\`\`\`${WLR}\`\`\``, inline: false },
				)
				.setTimestamp()
				.setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982', `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`);
			message.channel.send(LeaderboardEmbed)
		} catch (e) {
			console.log(e)
			return message.reply(`Maybe there's no data to give.`);
		}
	}
}
