const Discord = require('discord.js');
//const addToQueue = require('./queueFunctions/addToQueue.js');
//const shuffleArray = require('./queueFunctions/shuffle.js') //function to shuffle elements of given array
//const game = require('./queueFunctions/addToGame.js');
//incredibly broken
module.exports = {

    name: 'queue',
    description: 'Join a queue with =queue!',
    args: false,
    usage: '',
    aliases: ['que', 'q'],

    async execute(message, args, UserDB, GamesDB) {

        //cache variables
        const memberRolesCache = message.member.roles.cache;
        const guildChannelCache = message.guild.channels.cache;
        const guildRoleCache = message.member.guild.roles.cache;

        //check if author is: Registered, not Rank Banned, not Queuing, and not In Game.
        if (memberRolesCache.some(role => role.name === 'Rank Banned')) {
            message.reply(`You are rank banned. \nL`);
        } else  if (memberRolesCache.some(role => role.name === 'Queuing')) {
            message.reply(`You have already queued. Queue-dodging anyone?`);
        } else  if (memberRolesCache.some(role => role.name === 'In Game')) {
            message.reply(`You are already in a game.`);
        } else  if (memberRolesCache.some(role => role.name === 'Registered')) {

        const captain = guildRoleCache.find(role => role.name === 'Captain');
        const Queue1 = guildChannelCache.find(channel => channel.name === 'Queue #1');
        const Queue2 = guildChannelCache.find(channel => channel.name === 'Queue #2');

//function to move player from queuing channel to separate channel.
/*==================================================================*/
            if (message.member.voice.channel) {
                if (Queue1.members.size < 8) {
                    const queue = await addToQueue.addPlayerToQueue(message);
                    if (Queue1.members.size === 0) {
                        const createGame = await game.addToGame(message, GamesDB);
                        const GameID = createGame;
                        console.log(typeof queuedPlayers);
                        // const shuffledPlayers = await shuffleArray.shuffle(queuedPlayers)
                        // console.log(typeof shuffledPlayers)
                      }
                } else if (Queue2.members.size < 8) {
                    const queue = await queuingFunc.addToQueue(message);
                    if (Queue2.members.size === 7) {
                        const createGame = await game.addToGame(message, GamesDB);
          	        };
          	    }
            } else {
          	   message.reply("please join a voice channel.");
            };
/*==================================================================*/

        } else { //user does not have Registered role.
            message.reply(`please check that you are registered`);
        }
    },
};
