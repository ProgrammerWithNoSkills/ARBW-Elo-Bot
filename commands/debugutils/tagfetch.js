const Discord = require('discord.js');

module.exports = {
	name: 'tagfetch',
	description: 'fetch tags from database',
	args: true,
	usage: '<database> <field> ',
	cooldown: 5,
	aliases: [],
	permissions: 'ADMINISTRATOR',
	async execute(message, args, UserDB, GamesDB) {

    const database = args[0].trim();
	 	const searchTerm = args[1].trim();
    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await eval(database).findOne({ where: { ign: searchTerm } });
    if (tag) {
    	// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      //for (let i = 0; i < tag.length; i++) {
    	   return message.channel.send(`
IGN: ${tag.get(`ign`)}
ELO: ${tag.get(`elo`)}
MVP TIMES: ${tag.get(`mvp`)}
GAMES WON: ${tag.get(`gamesWon`)}
GAMES LOST: ${tag.get(`gamesLost`)}
GAMES VOIDED: ${tag.get(`gamesVoided`)}
          `);
       //}
    }
    return message.reply(`Could not find user with name: ${searchTerm}`);

	},
};
