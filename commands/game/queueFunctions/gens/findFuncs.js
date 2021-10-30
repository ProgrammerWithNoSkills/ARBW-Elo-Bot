
module.exports = {
	async memberRolesCacheFind(user, roleSearchTerm) {
		let hasRole = await user.roles.cache.some(role => role.name === `${roleSearchTerm}`);
		if (hasRole == undefined) {
			hasRole = await user.roles.cache.some(role => role.id === `${roleSearchTerm}`);
		};
		return hasRole;
	},

	async channelFind(user, channelSearchTerm) {
		let channel = await user.guild.channels.cache.find(c => c.name === `${channelSearchTerm}`);
		if (channel == undefined) {
			channel = await user.guild.channels.cache.find(c => c.id === `${channelSearchTerm}`);
		}
		if (channel) {
			return channel;
		};
		return false;
	},

	async findUserFromID(guild, userID) {
		let user = await guild.members.cache.find(m => m.id === `${userID}`);
		if (!user) {
			user = await guild.members.cache.find(m => m.displayName.split(` `)[1] === `${userID}`);
		};
		
		if (user) {
			return user;
		} else return false;
	},

};
