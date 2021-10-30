const config = require('../../../config.json');
const gameEmbeds = require('./gameEmbeds.js');
const pickTeamFuncs = require('./pickTeamFuncs.js'); //need the argIsolate from here
const findFuncs = require('./gens/findFuncs.js'); //find functions cause i need these too

module.exports = {

  async initBreakGame(gameTextChannel, pregameVC, players, gameID, GamesDB) {

      let commandCaller;
      try {
      //filter to detect if the command was sent
      const breakGameCommandFilter = async msg => {
        if (msg.content.startsWith(config.prefix)) {
          let args = await pickTeamFuncs.argIsolate(msg); //isolate args from command message
          if (args[0] === `breakgame` || args[0] === `bg`) {
            commandCaller = msg.member;
            return true; //player has typed the breakgame comamnd
          };
          return false; //message is not the breakgame command
        };
        return false; //message does not start with prefix
      };

      //await the command
      const breakGameCommand = await gameTextChannel.awaitMessages(await breakGameCommandFilter, { max: 1, time: 900000, errors: [`time`] })
      .catch(async () => {
        if (gameTextChannel) {
          await gameTextChannel.send(`=breakgame is no longer active, please contact staff if you want to break the game at this point, or just do =save and finish the game.`);
          return false;
        } else return `gameover`;
      });

      if (breakGameCommand) {
        //generate and send embed
        const breakGameEmbedObject = await gameEmbeds.generateBreakGameEmbed(gameTextChannel, commandCaller);
        const breakGameMessage = await gameTextChannel.send({embed: breakGameEmbedObject});

        //react to embed
        breakGameMessage.react(`✅`);
        breakGameMessage.react(`🛑`);

        //reaction filter
        async function reactionFilter(reaction) {
          if (reaction === `✅`) {
            return true;
          };
          return false;
        }

        //start collecting reactions
        const breakGameReactionYes = await breakGameMessage.awaitReactions(await reactionFilter(), {max: 5, time: 60000, errors: [`time`]} )
        .catch(async () => {
          await breakGameMessage.delete();
          return gameTextChannel.send(`The break game poll did not garner enough votes in time! Please continue with the game as usual.`)
        });

        //break the game because there are enough reactions.
        const gameAbortEmbedObject = await gameEmbeds.generateGameAbortedEmbed(gameTextChannel, gameID);
        await gameTextChannel.send({embed: gameAbortEmbedObject});

        //detele channels
        await setTimeout(async () => {await gameTextChannel.delete()}, 10000);
        await pregameVC.delete();
        const team1VC = await findFuncs.channelFind(players[0], `game-${gameID}-team1`);
        const team2VC = await findFuncs.channelFind(players[0], `game-${gameID}-team2`);
        if (team1VC && team2VC) {
          await team1VC.delete();
          await team2VC.delete();
        };

        //remove roles
        for (let i = 0; i < players.length; i++) {
          await players[i].roles.remove(config.roleIDs[`In Game`]);
          await players[i].roles.remove(config.roleIDs[`Captain`]);
        };

        //say game is aborted in GamesDB
        const gameData = await GamesDB.findOne( { where: { id: gameID } } );
        for (let i = 1; i < 3; i++) {
          for (let j = 1; j < 5; j++) {

            const playerField = `team${i}Player${j}`;
            const eloDeltaField = `t${i}P${j}Delta`;

            await gameData.update( { [`${playerField}`]: `ABORTED`} );
            await gameData.update( { [`${eloDeltaField}`]: `ABORTED`} );
          };
        };

        //send logging message
        const loggingChannel = await findFuncs.channelFind(players[0], config.channelIDs[`GamesAbortedLogging`]);
        let playerIDString = ``;
        for (let user of players) {
          playerIDString.concat(`<@${user.id}>, `);
        };
        await loggingChannel.send(`Game #${gameID} with players ${playerIDString}was aborted.`);

        return true;
      };
    } catch (e) {
      console.log(e);
      gameTextChannel.send(`Fatal error in BreakGameCommand`);
      return `fail`;
    };

  },
};
