const Discord = require("discord.js");

module.exports = {
    async addToGame(message, GamesDB) {
        const guildRoleCache = message.member.guild.roles.cache;
        const guildChannelCache = message.guild.channels.cache;
        const queuing = guildRoleCache.find(role => role.name === 'Queuing');
        const gaming = guildRoleCache.find(role => role.name === 'In Game');
        const gamesID = guildChannelCache.find(cat => cat.name === 'games');
        const newGame = await GamesDB.create();
        const latestGameIDTag = await GamesDB.findOne({ attributes: [`id`], order: [[`id`, `DESC`]], raw: true });
        const latestGameID = JSON.stringify(latestGameIDTag)
        const sanitizedGameID = latestGameID.replace(/\D/g, '');

        message.member.roles.add(gaming);
        message.member.roles.remove(queuing);
        message.guild.channels.create((`game-` + `${sanitizedGameID}`), {
            type: 'text',
            parent: gamesID,
        })
        return sanitizedGameID;
    },
};
