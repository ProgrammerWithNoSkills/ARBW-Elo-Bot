const Discord = require('discord.js');
module.exports = {
	name: 'test',
	description: '',
	args: false,
	usage: '',
	cooldown: 5,
	aliases: [],
	permissions: 'ADMINISTRATOR',
	async execute(message) {

			let i = 1
			let j = -5
			console.log(1 - -1);
			console.log(i - j);
			return;
	},
};
