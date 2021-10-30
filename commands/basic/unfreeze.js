const config = require('../../config.json');

const utilEmbed = require('../archive/utilEmbed.js');
const findFuncs = require('../game/queueFunctions/gens/findFuncs.js');

module.exports = {
	name: 'unfreeze',
	description: 'unfreeze player, used by screensharers to remove the Frozen role',
	args: true,
	argLength: 1,
	usage: '<ign/@>',
	cooldown: 5,
	aliases: ['unfrz','unfz'],
	permissions: '',
	async execute(message, args) {

    //check if player is a screensharer
    if (!message.member.roles.cache.has(config.roleIDs[`Screensharer`])) {
      let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, **you are not a Screensharer!** Only Screensharers can use \`=unfreeze\`!`);
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

      //if player does not have frozen role
      if (!playerObj.roles.cache.has(config.roleIDs[`Frozen`])) {
        let embed = await utilEmbed.genEmbed(false, `WHITE`, `**<@${message.member.id}>, that player is not frozen. They cannot be unfrozen.**`);
        return message.channel.send({embed: embed});
      };

      await playerObj.roles.remove(config.roleIDs[`Frozen`]);

      let embed = await utilEmbed.genEmbed(true, `WHITE`, `**<@${playerObj.id}> has been unfrozen. They can now queue again.**`);
      return message.channel.send({embed: embed});

    } catch (e) {
      console.log(e);
      let embed = await utilEmbed.genEmbed(false, `RED`, `There was an issue with unfreezing <@${playerID}>!`);
      return message.channel.send({embed: embed});
    };

	},
};
