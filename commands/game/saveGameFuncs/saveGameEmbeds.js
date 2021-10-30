const Discord = require('discord.js'); //discord js api

module.exports = {

	async genLogGameEmbed(player, gameNumber, image) {
    try {
      let SaveGameEmbedObject = new Discord.MessageEmbed()
      .setColor(`GREEN`)
      .setTitle(`Game #${gameNumber} Finished!`)
      .addFields(
				{ name: `\u200B`, value: `Pending scoring now.`, inline: false },
      )
      .setTimestamp()
      .setFooter(`Saved by ${player.user.tag}`, player.user.avatarURL())
      .setImage(image)

      return SaveGameEmbedObject;

    } catch (e) {
        console.log(e)
        return message.reply(`Error generating game saving embed. Please contact staff`);
    }
	},

  async genFinishGameEmbed(player, gameNumber) {
    try {
      let FinishGameEmbedObject = new Discord.MessageEmbed()
      .setColor(`GREEN`)
      .setTitle(`Game #${gameNumber} Finished!`)
      .addFields(
				{ name: `\u200B`, value: `Thank you for playing Asian Ranked Bedwars! Your game will be scored shortly.`, inline: false },
      )
      .setTimestamp()
      .setFooter(`Saved by ${player.user.tag}`, player.user.avatarURL())

      return FinishGameEmbedObject;

    } catch (e) {
        console.log(e)
        return message.reply(`Error generating game finishing embed. Please contact staff`);
    }
  },

};
