const utilEmbed = require('../archive/utilEmbed.js');
const config = require('../../config.json');

const rankUpChecker = require('./scoreFunctions/rankUpCheck.js');
const switchRole = require('./scoreFunctions/switchRole.js');
const findFuncs = require('./queueFunctions/gens/findFuncs.js');

module.exports = {
	name: 'void',
	description: 'void a game',
	args: true,
	argLength: 1,
	usage: '<gameNumber>',
	cooldown: 5,
	aliases: [],
	permissions: '',
	async execute(message, args, UserDB, GamesDB) {

    try {
      //check if player is a scorer
      if (!message.member.roles.cache.has(config.roleIDs[`Scorer`])) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `Whoa there <@${message.member.id}>, **you are not a Scorer!** Only Scorers can use \`=void\`!`);
        return message.channel.send({embed: embed});
      };

      //get given game id from args
      const gameID = args[0].replace(/[#]/g, '');

      //get game info from database
      const gameData = await GamesDB.findOne( { where: { id: gameID } } );

      if (!gameData) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, **Game #${gameID} does not exist yet!**`);
        return message.channel.send({embed: embed});
      };

      if (gameData.isVoided) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, **Game #${gameID} has already been voided!**`);
        return message.channel.send({embed: embed});
      };

      //reset players stats
      for (i = 1; i < 3; i++) {
        for (j = 1; j < 5; j++) {

          let playerEloDeltaField = `t${i}P${j}Delta`;
          let playerIDField = `team${i}Player${j}ID`;
          let playerObj;
					console.log(gameData);
          //find user in Database
          let player = await UserDB.findOne( { where: { userid: gameData[`${playerIDField}`] } } );
          //playerObj = await findFuncs.findUserFromID(message.guild, player.userid);

          let playerEloDelta = await gameData[`${playerEloDeltaField}`];

          let oldElo = player.elo;
          let newElo = oldElo - playerEloDelta;

          //update elo
          await player.update( { elo: `${newElo}` } );

          //see if they ranked back up or down, and if yes change the roles.
          let rankedUpOrDown = await rankUpChecker.checkRankUp(oldElo, newElo);
          //unpackage
          let upOrDown = rankedUpOrDown[0];
          if (upOrDown == `UP` || upOrDown == `DOWN`) {
            let currentRank = rankedUpOrDown[1];
            let newRank = rankedUpOrDown[2];
            //await switchRole.switchRole(playerObj, config.eloWinLoss[`${currentRank}`].role, config.eloWinLoss[`${newRank}`].role);
          };

          //update mvps if they were
          if (player.ign === gameData.MVP1
            || player.ign === gameData.MVP2
            || player.ign === gameData.MVP3) {
              let newMVPs = player.mvp - 1
              await player.update( { mvp: newMVPs } );
          };

          //update game won and lost
          if (i == gameData.wonBy) {
            let newGamesWon = player.gamesWon - 1;
            await player.update( { gamesWon: newGamesWon } );
          } else {
            let newGamesLost = player.gamesLost - 1;
            await player.update( { gamesWon: newGamesLost } );
          };

          //update games voided
          let newGamesVoided = player.gamesVoided + 1;
          await player.update( { gamesVoided: newGamesVoided } );

          //update player display name
          await playerObj.setNickname(`[${newElo}] ${player.ign}`);

        };
      };

      await gameData.update( { isVoided: true } );

			//send message to logging channel
			const voidLoggingChannel = await findFuncs.channelFind(message.member, config.channelIDs[`VoidLogging`]);
			await voidLoggingChannel.send({ embed: await utilEmbed.genEmbed(true, `BLACK`, `Game #${gameID} voided by <@${message.member.id}>`)});

      return message.channel.send({
				embed: await utilEmbed.genEmbed(true, `BLACK`, `Game #${gameID} successfully voided!`)
			});

    } catch (e) {
      console.log(e);
      return message.channel.send(`There was an error voiding the game. Please report this.`);
    };

	},
};
