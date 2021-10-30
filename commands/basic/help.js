const discord = require('discord.js'); 
const pagination = require('discord.js-pagination'); //used for the embed

module.exports = {
	name: 'help',
	description: 'imagine not knowing the commands',
	args: false,
	usage: '<command>',
	cooldown: 20,
	aliases: ['h'],
	async execute(message) {
/*======================================================================*/
		const page1 = new discord.MessageEmbed()
			.setColor('#5A03F8')
			.setTitle('**Basic commands**')
			.setDescription(`炫耀你的技能 \nFlex your lack of knowledge.`)
			.addFields(
				{ name: 'help', value: `\`\`\`This command\`\`\``, inline: false },
				{ name: 'register', value: `\`\`\`Registers\`\`\``, inline: false },
				{ name: 'rename', value: `\`\`\`Renames yourself\`\`\``, inline: false },
				{ name: 'unregister', value: `\`\`\`Unregisters and deletes your record\`\`\``, inline: false },
				{ name: 'viewgames', value: `\`\`\`Allows you to view games\`\`\``, inline: false },
				{ name: 'myprofile', value: `\`\`\`Allows you to view your profile\`\`\``, inline: false }
			)
/*======================================================================*/
		const page2 = new discord.MessageEmbed()
			.setColor('#5A03F8')
			.setTitle('**Game commands**')
			.setDescription(`炫耀你的技能 \nFlex your lack of knowledge.`)
			.addFields(
				{ name: 'queue', value: `\`\`\`Puts you in a queue\`\`\``, inline: false },
				{ name: 'leave', value: `\`\`\`Leaves queue\`\`\``, inline: false },
				{ name: 'save', value: `\`\`\`Saves game\`\`\``, inline: false },
				{ name: 'leaderboard', value: `\`\`\`To flex\`\`\``, inline: false },
			)
/*======================================================================*/
		const page3 = new discord.MessageEmbed()
			.setColor('#5A03F8')
			.setTitle('**Scoring commands**')
			.setDescription(`炫耀你的技能 \nFlex your lack of knowledge.`)
			.addFields(
				{ name: 'score', value: `\`\`\`Scores game\`\`\``, inline: false },
				{ name: 'close', value: `\`\`\`Closes game\`\`\``, inline: false },
				{ name: 'void', value: `\`\`\`Voids game\`\`\``, inline: false },
				{ name: 'freeze', value: `\`\`\`Freezes user\`\`\``, inline: false },
				{ name: 'unfreeze', value: `\`\`\`Unfreezes user\`\`\``, inline: false },
				{ name: 'rankban', value: `\`\`\`Rank bans user\`\`\``, inline: false },
			)
/*======================================================================*/
		const page4 = new discord.MessageEmbed()
			.setColor('#5A03F8')
			.setTitle('**Admin commands**')
			.setDescription(`炫耀你的技能 \nFlex your lack of knowledge.`)
			.addFields(
				{ name: 'updatename', value: `\`\`\`Syncs username and IGN\`\`\``, inline: false },
				{ name: 'reload', value: `\`\`\`Reloads command\`\`\``, inline: false },
				{ name: 'fake', value: `\`\`\`Creates a fake game in DB\`\`\``, inline: false },
				{ name: 'tagedit', value: `\`\`\`Edits tags manually\`\`\``, inline: false },
				{ name: 'tagfetch', value: `\`\`\`Fetches one tag\`\`\``, inline: false },
				{ name: 'tagfetchall', value: `\`\`\`Fetches all tags\`\`\``, inline: false },
				{ name: 'test', value: `\`\`\`Checks if there are integrity problems in console\`\`\``, inline: false }
			)
/*======================================================================*/

		const pages = [page1, page2, page3, page4]
		const emoji = ["⏪", "⏩"]
		const timeout = '30000'

		pagination(message, pages, emoji, timeout)

	},
};
