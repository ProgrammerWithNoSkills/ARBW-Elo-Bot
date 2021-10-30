const config = require('../../config.json');

const utilEmbed = require('../archive/utilEmbed.js');
const findFuncs = require('../game/queueFunctions/gens/findFuncs.js');

module.exports = {
	name: 'freeze',
	description: 'freeze player, used by screensharers to prevent players from queuing',
	args: true,
	argLength: 1,
	usage: '<ign/@>',
	cooldown: 5,
	aliases: ['fz','frz'],
	permissions: '',
	async execute(message, args) {

    //check if player is a screensharer
    if (!message.member.roles.cache.has(config.roleIDs[`Screensharer`])) {
      let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, **you are not a Screensharer!** Only Screensharers can use \`=freeze\`!`);
      return message.channel.send({embed: embed});
    };

    let playerID = args[0].replace(/[<!@>]/g,'');

    try {

      let playerObj = await findFuncs.findUserFromID(message.guild, playerID);

      //if player cannot be found.
      if (!playerObj) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `**<@${playerID}> cannot be found in the server. Did you type the username correctly?**`);
        return message.channel.send({embed: embed});
      };

      await playerObj.roles.add(config.roleIDs[`Frozen`]);

      let embed = await utilEmbed.genEmbed(true, `WHITE`, `**<@${playerObj.id}> has been frozen. They can no longer queue.**`);
      return message.channel.send({embed: embed});

    } catch (e) {
      console.log(e);
      let embed = await utilEmbed.genEmbed(false, `RED`, `There was an issue with freezing <@${playerID}>!`);
      return message.channel.send({embed: embed});
    };

	},
};
