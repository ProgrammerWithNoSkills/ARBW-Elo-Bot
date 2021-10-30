const Sequelize = require('sequelize'); //sqlite dependencies

const config = require('../../../config.json'); //config file

//function files
const mvpUpdate = require('./updateMVP.js'); //updateMVPs function
const calculateElo = require('./calcElo.js'); //calculate new elo function
const rankUpFunc = require('./rankUpCheck.js'); //check if player has ranked up function
const updateDispName = require('../../basic/genFuncs/updateDisplayName.js'); //update display name function
const checkWhetherMVP = require('./isMVPChecker.js'); //check whether given IGN is an MVP or not
const genScoringReport = require('./scoringReport.js'); //function to generate the scoring report

const findFuncs = require('../queueFunctions/gens/findFuncs.js');
const switchRole = require('./switchRole.js');
const utilEmbed = require('../../archive/utilEmbed.js');

module.exports = {

	async updateSelectedGameData(message, args, UserDB, selectedGameData, winningTeam) {

//get MVP data
//find MVP names from UserDB (could actually use member.name to update, but this is more purist. Might change if it slows bot dowm.)
//update MVPs in game database
/*======================================================================================*/
      const mvp1ID = args[2].replace(/[<>!@]/g, '');
			const mvp1IGN = args[2];

			//update MVP1
			const updateMVP1 = await mvpUpdate.updateMVP(message, UserDB, selectedGameData, mvp1ID, mvp1IGN, 1);
			if (updateMVP1 == false) {
				return false;
			}

      //optional 2nd and 3rd MVP
			if (args[3]) {
				const mvp2ID = args[3].replace(/[<>@!]/g, '');
				const mvp2IGN = args[3];

				const updateMVP2 = await mvpUpdate.updateMVP(message, UserDB, selectedGameData, mvp2ID, mvp2IGN, 2);
				if (updateMVP2 == false) {
					return false;
				};

				//3rd MVP
				if (args[4]) {
					const mvp3ID = args[4].replace(/[<>@!]/g, '');
					const mvp3IGN = args[4];

					const updateMVP3 = await mvpUpdate.updateMVP(message, UserDB, selectedGameData, mvp3ID, mvp3IGN, 3);
					if (updateMVP3 == false) {
						return false;
					};
				};
			};
//end of updating MVPs in database
/*======================================================================================*/

			//update winningTeam
			const updateWinningTeam = await selectedGameData.update( { wonBy: winningTeam } );

//update elo of players.
/*======================================================================================*/
			//arrays to record information for scoring report
			let playersEloChanges = [];
			let playersRankUpOrDown = [];

			//begin looping through selectedGameData to update each player's elo fields
			loop1:
				for (let j = 1; j < 3; j++) {
						loop2:
							for (let i = 1; i < 5; i++) {

								//extract player ign and id for each player.
								const playerField = `team${j}Player${i}`;
								const eloDeltaField = `t${j}P${i}Delta`;
								const playerIGN = selectedGameData[`${playerField}`];
								const playerID = selectedGameData[`${playerField}ID`];

								//check if this player won the game or not
								if (j == selectedGameData.wonBy) {
									var won = true;
								} else {
									var won = false;
								};

								try {
									//find current player elo from User database
								 	const currentPlayer = await UserDB.findOne({
										where: Sequelize.or( { ign: playerIGN }, { userid: playerID } ),
										});
									const currentPlayerObj = await findFuncs.findUserFromID(message.guild, currentPlayer.userid);

									//calculate new elo and elo delta
									var updatedElo = await calculateElo.calcElo(currentPlayer.elo, won, config);
									var eloDelta = updatedElo - currentPlayer.elo;

									//check if the player is an MVP
									const isMVP = await checkWhetherMVP.checkIfMVP(selectedGameData, playerIGN);

									//push elo, current elo, updated elo, eloDelta and isMVP to 2D array
									await playersEloChanges.push([`${currentPlayer.userid}`, currentPlayer.elo, updatedElo, eloDelta, isMVP]);

									//if player is MVP, add 10 elo to their elo change
									//after pushing to scoring report array because i need the updatedElo without +10
									if (isMVP) {
										updatedElo += 10;
										eloDelta += 10;
									};

									//check if user has ranked up.
									const rankedUp = await rankUpFunc.checkRankUp(currentPlayer.elo, updatedElo);

									//unpack function return package
									const rankUpOrDown = rankedUp[0];
									const currentEloRankInt = rankedUp[1];
									const updatedEloRankInt = rankedUp[2];

									if (rankedUp == `fail`) {
										message.reply(`Detecting whether ${playerField} ranked up or not failed.`);

									} else if (rankUpOrDown == `UP` || rankUpOrDown == `DOWN`) {
										//place player, rankupordown, and what rank to what rank into 2D array.
										await playersRankUpOrDown.push([rankUpOrDown, currentEloRankInt, updatedEloRankInt]);
									} else if (!rankedUp) {
										//push filler array
										await playersRankUpOrDown.push([false])
									};

									//update display name
									await currentPlayerObj.setNickname(`[${updatedElo}] ${currentPlayer.ign}`);

									/*===========UPDATING DB===========*/ //update database after extracting necessary data to not mess it up
									//update the player's elo delta in Games database
									const playerEloDelta = await selectedGameData.update({
										[`${eloDeltaField}`]: eloDelta
									});

									//update the player's elo in User database
									const updatedPlayer = await currentPlayer.update(
										{ elo: updatedElo }
									);

									//update the player's gamesWon/gamesLost in User database
									if (won) {
										let playerWins = currentPlayer.gamesWon + 1;
										let playerGamesPlayed = currentPlayer.gamesPlayed + 1;
										const updatedGamesWonOrLost = await currentPlayer.update({
											 gamesWon: playerWins,
											 gamesPlayed: playerGamesPlayed
										});
									} else {
										let playerLosses = currentPlayer.gamesLost + 1;
										let playerGamesPlayed = currentPlayer.gamesPlayed + 1;
										const updatedGamesWonOrLost = await currentPlayer.update({
											 gamesLost: playerLosses,
											 gamesPlayed: playerGamesPlayed
										});
									};

								 } catch (e) {
									  console.log(e);
									  return false;
								};
						};
				};
//end of updating user elos in UserDb and GamesDB
/*======================================================================================*/

//scoring report
/*======================================================================================*/
			let scoringReportInfoArr = [];
			playersRankUpOrDown = playersRankUpOrDown;

			//parse information into single array to send to scoring report generator
			for (let i = 0; i < 8; i++) {
				//unpack info
				const idScoring = `<@${playersEloChanges[i][0].value}>`;
				const eloBefore = playersEloChanges[i][1];
				let eloAfter = playersEloChanges[i][2];
				let eloDeltaScoring = playersEloChanges[i][3].toString();
				const isMVPScoring = playersEloChanges[i][4];

				if (eloDeltaScoring.charAt(0) === `-`) {
					eloDeltaScoring = eloDeltaScoring.replace(`-`, `- `);
				} else {
					eloDeltaScoring = `+ `.concat(eloDeltaScoring);
				}
				//concantenate each player's info into one string in one array index
				scoringReportInfoArr.push(
					`${idScoring}` 					//push each player's ID
					+ ` ⇄ `  								//push a `-` for beautification
					+ `${eloBefore}` 			//push elo before update
					+ ` ${eloDeltaScoring}` //push eloDelta
				);

				//check if player is an MVP, and if yes, add +10 to the scoring report
				if (playersEloChanges[i][4] == true) {
					scoringReportInfoArr[i] = scoringReportInfoArr[i].concat(` *+ 10*`);
					eloAfter += 10;
				};

				//add the remaning strings via concat to the element in the array.
				scoringReportInfoArr[i] = scoringReportInfoArr[i].concat(
					` → `							   //push an arrow for beautification
					+ `**${eloAfter}**`	 //push updated elo
				);


				//if player has ranked up or down, add a message under the main one saying so and switch the roles
				if (playersRankUpOrDown[i][0] != false) {
					let oldRole = await config.eloWinLoss[playersRankUpOrDown[i][1]].role;
					let newRole = await config.eloWinLoss[playersRankUpOrDown[i][2]].role;

					let userObj = await findFuncs.findUserFromID(message.guild, playersEloChanges[i][0].value);
					let changeRole = await switchRole.switchRole(userObj, oldRole, newRole);

					scoringReportInfoArr[i] = scoringReportInfoArr[i].concat(
						`\nRANK ${playersRankUpOrDown[i][0]}!`
						+ ` <@&${oldRole}>`
						+ ` ⇉ <@&${newRole}>\n`
					);
				};

			};

			//generate scoring report
			const scoringReportObject = await genScoringReport.generateScoringReport(
				message,
				selectedGameData.id,
				scoringReportInfoArr,
				);

			message.channel.send(scoringReportObject);
/*======================================================================================*/

			//update scoredByUser field in selectedGameData
			const scoredByUserID = message.member.id;
			await selectedGameData.update( { scoredBy: scoredByUserID } );

      //update 'scored' BOOLEAN
      const updateScoredStatus = await selectedGameData.update( { scored: true } );

      return true;
	 },
};
