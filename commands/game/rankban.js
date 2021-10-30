const Discord = require("discord.js");

module.exports = {
    name: 'rankban',
    description: 'Unregister with =unregister',
    args: true,
    usage: '<ign/@> <reason>',
    aliases: [`rb`, `rban`],
    permissions: 'ADMINISTRATOR',

//function
/*==================================================================*/
    async execute(message, args) {
        const userName = args[0];
        try {
            if (!(message.member.roles.cache.some(role => role.name == 'Rank Banned'))) {

                const rankbanned = message.guild.roles.cache.find(role => role.name == 'Rank Banned')
                const registered = message.guild.roles.cache.find(role => role.name == 'Registered')
                if (args.length != 2) {
                    return message.reply("You seem to have made a mistake.");
                }
                message.channel.send(`${userName} has been rank banned!`);
                message.member.roles.add(rankbanned);

            } else {
                message.channel.send(`${userName} has already been rank banned!`);
            }
        } catch (e) {
            console.error(e);
            return message.reply('Something went wrong, please contact staff.');
        }
    },
};
