const Discord = require('discord.js'); //discord js api

module.exports = {
    async generateScoringReport(message, gameID, scoringReportInfoArr) {

    		try {
    			var ScoringReportEmbed = new Discord.MessageEmbed()
    			.setColor(`#FFD700`)
    			.setAuthor(`Scoring Game #${gameID}`, `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`)
    			.setTitle(`**Ranked Bedwars Scoring Report**`)
    			.addFields(
                { name: '\u200B', value: scoringReportInfoArr, inline: false},
    			)
    			.setTimestamp()
    			.setFooter(`Scored by: ${message.member.user.tag}`, message.author.avatarURL());
    		return ScoringReportEmbed;

    		} catch (e) {
    				console.log(e)
    				return message.channel.send(`There was an error generating the scoring report for Game #${gameID}.\nPlease contact staff if this issue persists.`);
    		}
	},
};
