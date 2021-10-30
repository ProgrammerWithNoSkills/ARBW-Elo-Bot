const config = require('../../config.json') //config file
const Discord = require('discord.js');

module.exports = {
	name: 'leave',
	description: 'leave a queue safely. If you do this too many times you are liable to be striked by your `comrades`.',
	args: false,
	cooldown: 5,
	aliases: ['l', 'lv',`leavequeue`,`lvq`],
	permissions: '',
	async execute(message) {

		function leaveQueue(user) {
			let embed = new Discord.MessageEmbed()
			.setTitle(`Someone left the queue!`)
			.setDescription(`Player <@${user.id}> has left the queue!` + '**' + `\nIf you think this was done unreasonably, for queue-dodging or otherwise, please contact staff.` + '**')
			.setColor(`ORANGE`)
			.setTimestamp()

			return message.channel.send({ embed: embed });
		};

    try {
      if (message.member.roles.cache.some(r => r.id === config.roleIDs[`Queuing`])) {
      message.member.roles.remove(config.roleIDs[`Queuing`]);
			if (message.member.voice.channel) {
				message.member.voice.kick()
			};
      return leaveQueue(message.member, ``);
    	} else {
      return message.reply(`you are not in a queue!`);
			};
    } catch (e) {
			console.log(e)
			return;
    };
	},
};
