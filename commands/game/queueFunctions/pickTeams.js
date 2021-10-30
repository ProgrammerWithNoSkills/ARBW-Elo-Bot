const Discord = require('discord.js'); //discord js api

const config = require('../../../config.json');
const pickTeamFuncs = require('./pickTeamFuncs.js'); //misc. functions to pick teams
const gameEmbeds = require('./gameEmbeds.js'); //generate Embeds functions file
const utilEmbed = require('../../archive/utilEmbed.js');

const findFuncs = require('./gens/findFuncs.js');

module.exports = {
	async initTeamPick(gameTextChannel, gameCaptains, playerPool, gameID, prefix, message) {

      let teamsArr = [[],[]];
      await teamsArr[0].push(gameCaptains[0]);
      await teamsArr[1].push(gameCaptains[1]);

      //remove game captains from pool of players to pick
      await playerPool.shift();
      await playerPool.shift();

			//function to determine if playerPicked is in player pool, and if yes, remove.
      async function isInPlayerPool(player) {
        for (let i = 0; i < playerPool.length; i++) {
          if (playerPool[i].id === player.replace(/[#<>!@]/g, '')) {
						let playerObject = playerPool.splice(i, 1);
						let package = [true, playerObject[0]];
            return package;
          };
        };
        return [false];
      };

      //filter functions
      const teamPickVerify1 = async msg => {
        if (msg.content.startsWith(prefix)) {
					let args = await pickTeamFuncs.argIsolate(msg); //isolate args from command message
					if (args[0] && args[1]) {
						if (args[0] === `pick` || args[0] === `p`) {
							if (msg.author.id === gameCaptains[0].id) {
								let playerPoolVerify = await isInPlayerPool(args[1]); //check if player is in pool. This also removes them from pool if they are
								if (playerPoolVerify[0]) {
									teamsArr[0].push(playerPoolVerify[1]);
									return true;
								};
								msg.channel.send({ embed: await gameEmbeds.miscEmbed(`<@${msg.member.id}>, that player is not avalible to be picked!`) });
								return false; //player is not in pool
							};
							msg.channel.send({ embed: await gameEmbeds.miscEmbed(`<@${msg.member.id}>, you are not supposed to pick a player now.`) });
							return false; //player who typed is not Captain 1
						};
						return false; //args is not pick
					};
					return false; //validate if there are actual args
				};
				return false; //does message start with the prefix?
      }

      const teamPickVerify2 = async msg => {
        if (msg.content.startsWith(prefix)) {
					let args = await pickTeamFuncs.argIsolate(msg); //isolate args from command message
					if (args[0] && args[1]) {
						if (args[0] === `pick` || args[0] === `p`) {
							if (msg.author.id === gameCaptains[1].id) {
								let playerPoolVerify = await isInPlayerPool(args[1]); //check if player is in pool. This also removes them from pool if they are
								if (playerPoolVerify[0]) {
									teamsArr[1].push(playerPoolVerify[1]); //push player to teams Array
									return true;
								};
								msg.channel.send({ embed: await gameEmbeds.miscEmbed(`<@${msg.member.id}>, that player is not avalible to be picked!`) });
								return false; //player is not in pool
							};
							msg.channel.send({ embed: await gameEmbeds.miscEmbed(`<@${msg.member.id}>, you are not supposed to pick a player now.`) });
							return false; //player who typed is not Captain 1
						};
						return false; //args is not pick
					};
					return false; //validate if there are actual args
				};
				return false; //does message start with the prefix?
      }

      //function to pick random player from pool if time runs out.
      async function pickRandomFromPool() {
        let randomNum = Math.floor(Math.random() * playerPool.length);
				let randomNon = playerPool.splice(randomNum, 1);
        return randomNon[0];
      };

			//function to generate a player pool array
			async function genPlayerPoolArr() {
				let playerPoolArr = [];
				for (let i of playerPool) {
					await playerPoolArr.push(`<@${i.id}>`);
				};
				return playerPoolArr;
			};

			try {
      /* =========== Captain 1 Turn 1 =========== */
      await gameTextChannel.send( {content: `<@${gameCaptains[0].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`RED`, 1, gameCaptains[0], await genPlayerPoolArr())} );
      const c1T1 = await gameTextChannel.awaitMessages(await teamPickVerify1, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 1 to pcik
			.catch(async e => { //if captain 1 takes too long, pick random.
				let ranPlayer1 = await pickRandomFromPool();
				await gameTextChannel.send({
					content: `<@${gameCaptains[0].id}>`,
					embed: await utilEmbed.genEmbed(true, `RED`, `You ran out of time to choose! <@${ranPlayer1.id}> was picked for you!`)
				});
				await teamsArr[0].push(ranPlayer1);
				return true;
			});

      	/* =========== Captain 2 Turn 1 =========== */
				await gameTextChannel.send( {content: `<@${gameCaptains[1].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`BLUE`, 2, gameCaptains[1], await genPlayerPoolArr())} );
	      const c2T1 = await gameTextChannel.awaitMessages(await teamPickVerify2, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 2 to pcik
				.catch(async e => { //if captain takes too long, pick random.
					let ranPlayer2 = await pickRandomFromPool();
					await gameTextChannel.send({
						content: `<@${gameCaptains[1].id}>`,
						embed: await utilEmbed.genEmbed(true, `BLUE`, `You ran out of time to choose! <@${ranPlayer2.id}> was picked for you!`)
					});
					await teamsArr[1].push(ranPlayer2);
					return true;
				});

				/* =========== Captain 2 Turn 2 =========== */
				await gameTextChannel.send( {content: `<@${gameCaptains[1].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`BLUE`, 2, gameCaptains[1], await genPlayerPoolArr())} );
	      const c2T2 = await gameTextChannel.awaitMessages(await teamPickVerify2, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 2 to pcik
				.catch(async e => { //if captain takes too long, pick random.
					let ranPlayer3 = await pickRandomFromPool();
					await gameTextChannel.send({
						content: `<@${gameCaptains[1].id}>`,
						embed: await utilEmbed.genEmbed(true, `BLUE`, `You ran out of time to choose! <@${ranPlayer3.id}> was picked for you!`)
					});
					await teamsArr[1].push(ranPlayer3);
					return true;
				});

				/* =========== Captain 1 Turn 2 =========== */
	      await gameTextChannel.send( {content: `<@${gameCaptains[0].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`RED`, 1, gameCaptains[0], await genPlayerPoolArr())} );
	      const c1T2 = await gameTextChannel.awaitMessages(await teamPickVerify1, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 1 to pcik
				.catch(async e => { //if captain 1 takes too long, pick random.
					let ranPlayer4 = await pickRandomFromPool();
					await gameTextChannel.send({
						content: `<@${gameCaptains[0].id}>`,
						embed: await utilEmbed.genEmbed(true, `RED`, `You ran out of time to choose! <@${ranPlayer4.id}> was picked for you!`)
					});
					await teamsArr[0].push(ranPlayer4);
					return true;
				});

				/* =========== Captain 1 Turn 3 =========== */
	      await gameTextChannel.send( {content: `<@${gameCaptains[0].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`RED`, 1, gameCaptains[0], await genPlayerPoolArr())} );
	      const c1T3 = await gameTextChannel.awaitMessages(await teamPickVerify1, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 1 to pcik
				.catch(async e => { //if captain 1 takes too long, pick random.
					let ranPlayer5 = await pickRandomFromPool();
					await gameTextChannel.send({
						content: `<@${gameCaptains[0].id}>`,
						embed: await utilEmbed.genEmbed(true, `RED`, `You ran out of time to choose! <@${ranPlayer5.id}> was picked for you!`)
					});
					await teamsArr[0].push(ranPlayer5);
					return true;
				});

				/* =========== Captain 2 Turn 3 =========== */
				await gameTextChannel.send( {content: `<@${gameCaptains[1].id}>`, embed: await gameEmbeds.generateCaptinPickEmbed(`BLUE`, 2, gameCaptains[1], await genPlayerPoolArr())} );
	      const c2T3 = await gameTextChannel.awaitMessages(await teamPickVerify2, { max: 1, time: 60000, errors: [`time`] }) //wait for captain 2 to pcik
				.catch(async e => { //if captain takes too long, pick random.
					let ranPlayer6 = await pickRandomFromPool();
					await gameTextChannel.send({
						content: `<@${gameCaptains[1].id}>`,
						embed: await utilEmbed.genEmbed(true, `BLUE`, `You ran out of time to choose! <@${ranPlayer6.id}> was picked for you!`)
					});
					await teamsArr[1].push(ranPlayer6);
					return true;
				});

			} catch (e) {
				console.log(`pickTeams error:\n ${e}`);
				return message.channel.send(`There was a fatal error in the captain picking procedure. Please report this to staff immediately.`);
			};

      //parse information for the Teams embed
      let teamArr1 = [];
      let teamArr2 = [];
      teamArr1.push(`**Team 1:**`);
      teamArr2.push(`**Team 2:**`);
      teamArr1.push(`<@${teamsArr[0][0].id}>`);
      teamArr2.push(`<@${teamsArr[1][0].id}>`);
      for (i = 1; i < 4; i++) {
        await teamArr1.push(`<@${teamsArr[0][i].id}>`);
        await teamArr2.push(`<@${teamsArr[1][i].id}>`);
      };

      const teamsPickedEmbed = await gameEmbeds.generateTeamsPickedEmbed(teamArr1, teamArr2, gameID, gameTextChannel);
			await gameTextChannel.send(teamsPickedEmbed);

			//send to logging channel also
			const loggingChannel = await findFuncs.channelFind(gameCaptains[0], config.channelIDs[`GameStartLogging`]);
			await loggingChannel.send(teamsPickedEmbed);

      return teamsArr;
	},
};
