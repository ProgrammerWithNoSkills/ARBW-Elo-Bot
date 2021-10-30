const Discord = require('discord.js');
const Sequelize = require('sequelize'); //sqlite dependencies

module.exports = {
	name: 'tagedit',
	description: 'directly edit database entries, use with caution',
	args: true,
	usage: '<database> <playerIGN/UUID/gameID> <fieldToBeEdited> <value>',
	cooldown: 5,
	aliases: ['tgedt','tgedit','tagedt'],
	permissions: 'ADMINISTRATOR',
	async execute(message, args, UserDB, GamesDB) {

			if (args.length != 4) {
				return message.reply("You seem to have made a mistake.");
			}

			var dbSelected = args[0];
			const uuid = args[1];
			const playerID = args[1].replace(/[^a-zA-Z0-9 ]/g, "");
			const field = args[2];
			const value = args[3];

			try {

				if (dbSelected === `UserDB`) {
					var affectedRows = await UserDB.update({ [`${field}`]: value }, { where: Sequelize.or( { ign: uuid }, { userid: playerID } ) } );
				} else if (dbSelected === `GamesDB`) {
					var affectedRows = await GamesDB.update({ [`${field}`]: value }, { where: { id: uuid } } );
				}

				if (affectedRows == 1) {
					return message.reply(`Database field **${field}** was edited.`);
				} else if (affectedRows > 1) {
					return message.reply(`You edited more than one entry, hold up.`)
				}

			} catch (e) {
				console.log(e);
				return message.reply(`There was an error editing the database.`);
			}
			return message.reply(`Could not find a tag with name ${field}. Did you write the field name correctly?`);
	},
};
