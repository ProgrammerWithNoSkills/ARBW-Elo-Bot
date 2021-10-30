const Discord = require('discord.js');
const Fetch = require('node-fetch');
const Sequelize = require('sequelize'); //sqlite dependencies
//const nodeHtmlToImage = require('node-html-to-image')

module.exports = {
	name: 'myprofile',
	description: 'view your profile and stats!',
	args: false,
	usage: '',
	cooldown: 60,
	aliases: ['i', 'me', 'myp'],
	permissions: '',
/*======================================================================*/
	async execute(message, args, UserDB, GamesDB) {
		//pulls user data from database
/*======================================================================*/
		try {
			const player = await UserDB.findOne({ where: { userid: message.author.id } });
			const eloRank = await UserDB.findAll({ attributes: [`ign`, `elo`], order: [[`elo`, `DESC`]] });
			let eloPos = [];
			eloRank.forEach(async eloRank => { eloPos.push(eloRank) })
			for (let i = 0; i < eloPos.length; i++) {
				if (eloPos[i].ign === player.ign) {
					var trueEloRank = i + 1;
				}
			}
			const mvpRank = await UserDB.findAll({ attributes: [`ign`, `mvp`], order: [[`mvp`, `DESC`]] });
			let mvpPos = [];
			mvpRank.forEach(async mvpRank => { mvpPos.push(mvpRank) })
			for (let i = 0; i < mvpPos.length; i++) {
				if (mvpPos[i].ign === player.ign) {
					var trueMvpRank = i + 1;
				}
			}
			const gamesRank = await UserDB.findAll({ attributes: [`ign`, `gamesPlayed`], order: [[`gamesPlayed`, `DESC`]] });
			let gamesPos = [];
			gamesRank.forEach(async gamesRank => { gamesPos.push(gamesRank) })
			for (let i = 0; i < gamesPos.length; i++) {
				if (gamesPos[i].ign === player.ign) {
					var trueGamesRank = i + 1;
				}
			}
			const winsRank = await UserDB.findAll({ attributes: [`ign`, `gamesWon`], order: [[`gamesWon`, `DESC`]] });
			let winsPos = [];
			winsRank.forEach(async winsRank => { winsPos.push(winsRank) })
			for (let i = 0; i < winsPos.length; i++) {
				if (winsPos[i].ign === player.ign) {
					var trueWinsRank = i + 1;
				}
			}
			const lossesRank = await UserDB.findAll({ attributes: [`ign`, `gamesLost`], order: [[`gamesLost`, `DESC`]] });
			let lossesPos = [];
			lossesRank.forEach(async lossesRank => { lossesPos.push(lossesRank) })
			for (let i = 0; i < lossesPos.length; i++) {
				if (lossesPos[i].ign === player.ign) {
					var trueLossesRank = i + 1;
				}
			}

			if (player.gamesLost === 0) {
				var WLR = player.gamesWon / (player.gamesLost + 1);
			} else {
				WLR = player.gamesWon / player.gamesLost;
			}
			const gamesPlayed = player.gamesLost + player.gamesWon;
		} catch (e) {
			console.log(e)
			return message.reply(`Maybe there's no data to give.`);
		}

/*======================================================================*/
		try {
			var LeaderboardEmbed = new Discord.MessageEmbed()
				.setColor('#5A03F8')
				.setTitle('**Your stats**')
				.setDescription(`炫耀你的技能 \nFlex your skills and dedication`)
				.addFields(
					//inline patterns are based off the previous field
					//ignore the \`\`\`(for embeds)
					{ name: 'Elo', value: `\`\`\`py\n${player.elo} #${trueEloRank} \`\`\``, inline: true },
					{ name: 'MVPs', value: `\`\`\`py\n${player.mvp} #${trueMvpRank} \`\`\``, inline: true },
					{ name: 'Games Played', value: `\`\`\`py\n${gamesPlayed} #${trueGamesRank} \`\`\``, inline: false },
					{ name: 'Wins', value: `\`\`\`py\n${player.gamesWon} #${trueWinsRank} \`\`\``, inline: true },
					{ name: 'Losses', value: `\`\`\`py\n${player.gamesLost} #${trueLossesRank} \`\`\``, inline: true },
					{ name: 'WLR', value: `\`\`\`py\n${WLR}\`\`\``, inline: true },
					{ name: 'Recent Games', value: `Coming Soon`, inline: false }
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
