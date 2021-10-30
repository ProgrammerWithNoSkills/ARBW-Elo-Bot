//dependencies
const Discord = require('discord.js'); //discord js api

const config = require('../../config.json'); //config file

const utilEmbed = require('../archive/utilEmbed.js');

//function files
const findFuncs = require('./queueFunctions/gens/findFuncs.js'); //misc. find functions
const addToVCAndQueue = require('./queueFunctions/addUserToChannel.js'); //function to add player to a vc
const roleExchange = require('./queueFunctions/gens/roleExchange.js') //functions to add and remove roles
const createGameChannels = require('./queueFunctions/createGameChannels.js'); //functions to create game channels
const shuffle = require('./queueFunctions/gens/shuffle.js'); //function to shuffle elements of array
const selectCaptain = require('./queueFunctions/selectCaptain.js'); //choose captains and give them captain roles
const gameEmbeds = require('./queueFunctions/gameEmbeds.js'); //generate embed of captains to send to Games channel
const pickTeams = require('./queueFunctions/pickTeams.js'); //function to allow captains to pick teams
const breakGame = require('./queueFunctions/breakgame.js'); //function to break/abort the game

module.exports = {
	name: 'queue',
	description: 'Join a queue against other players!',
	args: false,
	usage: '<queue>',
	cooldown: 5,
	aliases: ['q', 'join', 'j', 'jq'],
	permissions: '',
	async execute(message, args, UserDB, GamesDB) {

			//place the user object into a variable
			const user = message.member;

      //check if author is: Registered, not Rank Banned, not Queuing, and not In Game.
      if (await findFuncs.memberRolesCacheFind(user, `Frozen`) == true) {
          return message.reply(`You are frozen lol. \nL`);
      } else if (await findFuncs.memberRolesCacheFind(user, `Queuing`) == true) {
          return message.reply(`You have already queued. Queue-dodging anyone?`);
      } else if (await findFuncs.memberRolesCacheFind(user, `In Game`) == true) {
          return message.reply(`You are already in a game.`);
      } else if (await findFuncs.memberRolesCacheFind(user, `Registered`) == true) {

//main function
/*=====================================================*/
				//constants
				const Prequeue = await findFuncs.channelFind(user, config.channelIDs.Prequeue);

				//queue objects
				const Queue1 = await findFuncs.channelFind(user, config.channelIDs.Queue1);
				const Queue2 = await findFuncs.channelFind(user, config.channelIDs.Queue2);
				let Queue;

				if (args[0] === `1`) {
					Queue = Queue1;
				} else if (args[0] === `2`) {
					Queue = Queue2;
				} else {
					let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, please enter a valid queue! This is either 1 or 2.`);
		      return message.channel.send({embed: embed});
				};

        if (message.member.voice.channelID == Prequeue.id) { //check if player is in voice channel `Prequeue`
					try {

					const playersInQueue = await addToVCAndQueue.addToChannel(user, Queue); //returns array of players in the VC
					const addedQueuing = await roleExchange.addQueuing(user);
					const queuingEmbedObject = await gameEmbeds.queuingEmbed(message, playersInQueue.length);
					await message.channel.send({embed: queuingEmbedObject});

					//if the queue is full
					if (playersInQueue.length >= Queue.userLimit) {

						//get all info to make a new game Channel
						const game = await GamesDB.create();	//create a new game in database
						//get the latest game id
						const gameID = await GamesDB.findAll({
							attributes: [`id`],
							limit: 1,
							order: [ [ 'createdAt', 'DESC' ] ]
						});
						const gamesCategoryID = config.categoryIDs.Games; //get the Games category from config.json

						//get the ids of playersInQueue
						let playersInQueueIDs = [];
						for (let i = 0; i < playersInQueue.length; i++) {
							await playersInQueueIDs.push(playersInQueue[i].id);
						};

						console.log(playersInQueueIDs);
						//create the game channels.
						const gameTextChannelCreated = await createGameChannels.createGameTextChannel(
							gamesCategoryID,
							user,
							playersInQueueIDs,
							gameID[0].id
						);
						const pregameVCCreated = await createGameChannels.createPregameVoiceChannel(gamesCategoryID, user, gameID[0].id, playersInQueueIDs);

						//find the game channel objects
						const gameTextChannel = await findFuncs.channelFind(user, `game-${gameID[0].id}`);
						const pregameVC = await findFuncs.channelFind(user, `game-${gameID[0].id}-pickingteams`);

						//add the In Game role to all players
						for (let i of playersInQueue) {
							await roleExchange.addInGameRemoveQueuing(i);
						};

						//move all players to pregameVC
						for (let i of playersInQueue) {
							await i.voice.setChannel(pregameVC);
						};

						//start the breakGame command waiting for someone to type break game(not await because yknow, itll hold everything up)
						const breakTheGame = breakGame.initBreakGame(gameTextChannel, pregameVC, playersInQueue, gameID[0].id, GamesDB);

						/*========== choosing captains ==========*/
						//shuffle array elements
						const playersInGame = await shuffle.shuffleArray(playersInQueue);

						//assign captain role, send a message in the Game's text channel saying who are the captains
						const gameCaptains = await selectCaptain.selectCaptains(playersInGame);

						//ping all players in the game text channel
						let playersInGamePing = ``;
						for (let i of playersInGame) {
							playersInGamePing = playersInGamePing.concat(`${i}, `);
						};
						await gameTextChannel.send(playersInGamePing);
						/*========== end choosing captains ==========*/

						//generate an embed for captains
						const gameStartEmbedObject = await gameEmbeds.generateGameStartEmbed(gameCaptains, gameID, gameTextChannel);
						await gameTextChannel.send(gameStartEmbedObject); //send the embed to the game text channel.

						//allow captains to pick teams
						const teams = await pickTeams.initTeamPick(
							gameTextChannel,
							gameCaptains,
							playersInGame,
							gameID[0].id,
							config.prefix,
							message
						);

						//create team calls, move each player to team call.
						const team1VCCreated = await createGameChannels.createTeam1VoiceChannel(gamesCategoryID, user, gameID[0].id, teams[0]);
						const team2VCCreated = await createGameChannels.createTeam2VoiceChannel(gamesCategoryID, user, gameID[0].id, teams[1]);
						const teamVC1 = await findFuncs.channelFind(user, `game-${gameID[0].id}-team1`);
						const teamVC2 = await findFuncs.channelFind(user, `game-${gameID[0].id}-team2`);
						for (let i of teams[0]) {
							await i.voice.setChannel(teamVC1);
						};
						for (let j of teams[1]) {
							await j.voice.setChannel(teamVC2);
						};

						//update database with player names and ids
						await game.update({ team1Player1ID: teams[0][0].id });
						await game.update({ team1Player2ID: teams[0][1].id });
						await game.update({ team1Player3ID: teams[0][2].id });
						await game.update({ team1Player4ID: teams[0][3].id });
						await game.update({ team2Player1ID: teams[1][0].id });
						await game.update({ team2Player2ID: teams[1][1].id });
						await game.update({ team2Player3ID: teams[1][2].id });
						await game.update({ team2Player4ID: teams[1][3].id });
						const t1P1 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[0][0].id } });
						const t1P2 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[0][1].id } });
						const t1P3 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[0][2].id } });
						const t1P4 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[0][3].id } });
						const t2P1 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[1][0].id } });
						const t2P2 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[1][1].id } });
						const t2P3 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[1][2].id } });
						const t2P4 = await UserDB.findOne({ attributes: [`ign`], where: { userid: teams[1][3].id } });
						await game.update({ team1Player1: t1P1.ign });
						await game.update({ team1Player2: t1P2.ign });
						await game.update({ team1Player3: t1P3.ign });
						await game.update({ team1Player4: t1P4.ign });
						await game.update({ team2Player1: t2P1.ign });
						await game.update({ team2Player2: t2P2.ign });
						await game.update({ team2Player3: t2P3.ign });
						await game.update({ team2Player4: t2P4.ign });

						return;

					} else return;
				} catch (e) {
					console.log(e);
					return message.reply(`there was an error.`);
				}
/*=====================================================*/
				} else {
					return message.reply(`please join the Prequeue voice channel.`);
				};

      } else { //user does not have Registered role
				return message.reply(`please check that you are registered. If this is a mistake, please contact staff.`);
			};

	},
};
