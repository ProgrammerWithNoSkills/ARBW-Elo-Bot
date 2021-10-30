const Discord = require('discord.js'); //discord js api

module.exports = {
	name: 'utilEmbedadadadad',
	description: '',
	args: false,
	usage: '<are you really this stupid>',
	cooldown: 5,
	aliases: [],
	permissions: 'ADMINISTRATOR',
	async genEmbed(timestamp, color, description, content, title, author) {
    try {
		let EmbedObject = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setDescription(`${description}`)

		if (content) {
			EmbedObject.addFields(
				{name: '\u200B', value: `${content}`},
			);
		};

		if (title) {
			EmbedObject.setTitle(`${title}`);
		};

		if (author) {
			EmbedObject.setAuthor(`${author}`);
		};

		if (timestamp) {
			EmbedObject.setTimestamp();
		};

		return EmbedObject;

		} catch (e) {
			console.log(e)
			return message.reply(`Error generating general Embed Object. Please contact staff.`);
		};
	},
};
