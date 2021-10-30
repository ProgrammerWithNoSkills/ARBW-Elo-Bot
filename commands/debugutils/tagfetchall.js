const Discord = require('discord.js');

module.exports = {
	name: 'tagfetchall',
	description: 'fetch all tags in a column',
	args: true,
	usage: '<columnName>',
	cooldown: 5,
	aliases: [],
	permissions: 'ADMINISTRATOR',
	async execute(message, args, UserDB) {
    // equivalent to: SELECT name FROM tags;
    const tagList = await UserDB.findAll({ attributes: [ args[0] ] });
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    return message.channel.send(`List of tags: ${tagString}`);
	},
};
