const updateDisplayNameFunc = require('./genFuncs/updateDisplayName.js');

module.exports = {
	name: 'updatename',
	description: 'update someone\'s display name if it ever desyncs',
	args: true,
	argLength: 1,
	usage: '<name/@>',
	cooldown: 5,
	aliases: ['updtname', 'updtename', 'nameupdate', 'nmupdt'],
	permissions: '',
	async execute(message, args, UserDB) {
			//remove unnecessary characters from userid
      const userUUID = args[0].replace(/[!<>@]/g, '');

			//update display name. See ./genFuncs/updaateDisplayName
			const displayNameUpdate = updateDisplayNameFunc.updateDisplayName(message, UserDB, userUUID);
			if (displayNameUpdate == false) {
				return;
			};

      return message.channel.send(`User **${displayNameUpdate.ign}**'s display name is up to date.`);
	},
};
