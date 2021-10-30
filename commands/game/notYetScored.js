const Discord = require('discord.js');

module.exports = {
	name: 'notyetscored',
	description: 'for anyone to use to see which games have not yet been scored',
	args: false,
	usage: '<>',
	cooldown: 10,
	aliases: ['nys'],
	permissions: '',
	async execute(message, args, UserDB, GamesDB) {

    //embed generator
    async function genEmbed(numOfUnscored, unscoredArr) {
      let Embed = new Discord.MessageEmbed()
      .setColor(`PURPLE`)
      .setTitle(`:exclamation: | Asian Ranked Bedwars Unscored Games | :exclamation:`)
      .addFields(
        { name: `\u200B`, value: `There are ${numOfUnscored} unscored games currently.`},
        { name: `\u200B`, value: unscoredArr, inline: true },
      )
      .setTimestamp()
      .setFooter('ARBW Bot by suiseide#8744 & BIGOOF#5982', `https://cdn.discordapp.com/attachments/822470978859827243/850716000071450644/Screenshot_2021-05-28-22-13-13-30.jpg`);

      return Embed;
    };

    //main function
    try {

      const unscoredGames = await GamesDB.findAll( { attributes: [`id`], where: { scored: false } } );
      const numOf = unscoredGames.length;

      //push to array.
      let unscoredGamesArr = [];
      if (numOf > 0) {
				unscoredGamesArr.push(`__They are:__`)
				for (let i = 0; i < unscoredGames.length; i++) {
					unscoredGamesArr.push(`#${unscoredGames[i].id}`);
				};
      } else {
        unscoredGamesArr.push(`\u200B`);
      };

			const embedMessage = await genEmbed(numOf, unscoredGamesArr);
			return message.channel.send(embedMessage);

    } catch (e) {
      console.log(e);
      return message.channel.send(`There was a problem with generating which games are yet to be scored. Pleas report.`);
    };

	},
};
