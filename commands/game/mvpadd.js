const Sequelize = require('sequelize');

const utilEmbed = require('../archive/utilEmbed.js'); //utility embed generator
const config = require('../../config.json'); //config file
const rankUpCheck = require('./scoreFunctions/rankUpCheck.js');
const findFuncs = require('./queueFunctions/gens/findFuncs.js');

module.exports = {
	name: 'mvpadd',
	description: 'add an MVP to a game.',
	args: true,
	usage: '<gameID> <mvp>',
	cooldown: 5,
	aliases: [],
	permissions: '',
	async execute(message, args, UserDB, GamesDB) {

    try {

      //check if player is a scorer
      if (!message.member.roles.cache.has(config.roleIDs[`Scorer`])) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `Whoa there <@${message.member.id}>, **you are not a Scorer!** Only Scorers can use \`=mvp\`!`);
        return message.channel.send({embed: embed});
      };

      //check if they put more than one mvp
      if (args.length > 2) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `Please only input one MVP at a time!`);
        return message.channel.send({embed: embed});
      };

      const gameID = args[0].replace(/[#]/g, '');
			let theMVP;
			if (args[1]) {
				theMVP = args[1].replace(/[<!@>]/g, '');
			} else return message.channel.send({embed: await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, please input a player for to add as MVP!`)});

      //extract game data
      const gameData = await GamesDB.findOne( { where: { id: gameID } } );

      if (!gameData) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, game \`#${gameID}\` does not yet exist!`);
        return message.channel.send({embed: embed});
      };

      //extract player data
      const theMVPTag = await UserDB.findOne( { where: Sequelize.or( { userid: theMVP }, { ign: theMVP } ) } );
      const theMVPObj = await findFuncs.findUserFromID(message.guild, theMVP);

      if (!theMVPTag /*|| !theMVPObj*/) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, the player you inputted does not exist in the database!`);
        return message.channel.send({embed: embed});
      };

      if (gameData.isVoided) {
        let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, game \`#${gameID}\` has been voided!`);
        return message.channel.send({embed: embed});
      };

/* ==================== main function ====================== */

      //update player elo delta
      //find the delta
      let playerEloDeltaField;
      loop1:
      for (let i = 1; i < 3; i++) {
        loop2:
        for (let j = 1; j < 5; j++) {
          let playerIDField = `team${i}Player${j}ID`;
          let playerID = gameData[`${playerIDField}`];
          if (playerID === theMVPTag.userid) {
            playerEloDeltaField = `t${i}P${j}Delta`;
            break loop1;
          };
        };
      };

			//cannot find player id in selected game, player given did not play that game
			if (!playerEloDeltaField) {
				let embed = await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, <@${theMVPTag.userid}> did not play Game \`#${gameID}\`!`);
        return message.channel.send({embed: embed});
			};

			//update game MVP data
      if (gameData.MVP1 === `N/A`) {

        await gameData.update( { MVP1: theMVPTag.ign } );

      } else if (gameData.MVP2 === `N/A`) {

				if (gameData.MVP1 !== theMVPTag.ign) {

        	await gameData.update( { MVP2: theMVPTag.ign } );

				} else return message.channel.send({embed: await utilEmbed.genEmbed(  //if the player is already an MVP, return.
					false,
					`RED`,
					`<@${message.member.id}>, player <@${theMVPTag.userid}> is already an MVP of Game \`#${gameID}\`!`
				)});

      } else if (gameData.MVP3 === `N/A`) {

				if (gameData.MVP1 !== theMVPTag.ign && gameData.MVP2 !== theMVPTag.ign) {
        	await gameData.update( { MVP3: theMVPTag.ign } );
				} else return message.channel.send({embed: await utilEmbed.genEmbed(  //if the player is already an MVP, return.
					false,
					`RED`,
					`<@${message.member.id}>, player <@${theMVPTag.userid}> is already an MVP of Game \`#${gameID}\`!`
				)});

      } else {
        return message.channel.send({embed: await utilEmbed.genEmbed(false, `RED`, `<@${message.member.id}>, game \`#${gameID}\` already has 3 MVPs!`)});
      };

			//update elo delta in game database
      let oldEloDelta = gameData[playerEloDeltaField];
      let newEloDelta = oldEloDelta + 10;
      await gameData.update( { [playerEloDeltaField]: newEloDelta } );

      //update player stats
      const oldElo = theMVPTag.elo;
      const newElo = oldElo + 10;
      const newMVP = theMVPTag.mvp + 1;

      let rankUpOrDown = await rankUpCheck.checkRankUp(oldElo, newElo);
      //unpackage
      let upOrDown = rankUpOrDown[0];
      let currentRank = rankUpOrDown[1];
      let newRank = rankUpOrDown[2];
      if (upOrDown == `UP` || upOrDown == `DOWN`) {
        await switchRole.switchRole(theMVPObj, config.eloWinLoss[`${currentRank}`].role, config.eloWinLoss[`${newRank}`].role);
      };

      //update stats in DB
      await theMVPTag.update( { elo: newElo } );
      await theMVPTag.update( { mvp: newMVP } );

      //sync nickname
      await theMVPObj.setNickname(`[${newElo}] ${theMVPTag.ign}`);

      //parse info for mini scoring report
      let scoringMVPStr = `<@${theMVPTag.userid}> ⇄ ${oldElo} + 10 → ${newElo}`;
      if (upOrDown == `UP` || upOrDown == `DOWN`) {
        let oldRole = await config.eloWinLoss[currentRank].role;
        let newRole = await config.eloWinLoss[newRank].role;
        scoringMVPStr = scoringMVPStr.concat(
          `\nRANK ${upOrDown}!`
          + ` <@&${oldRole}>`
          + ` ⇉ <@&${newRole}>`
        );
      };

      let mvpEmbed = await utilEmbed.genEmbed(
        true,
        `#FFD700`,
				`**Player <@${theMVPTag.userid}> has been set as an MVP in Game \`#${gameID}\`**`,
        `${scoringMVPStr}`,
      );

      return message.channel.send(mvpEmbed);

    } catch (e) {
      console.log(e);
      let embed = await utilEmbed.genEmbed(false, `RED`, `There was an error adding an MVP to that game. Please report this.`);
      return message.channel.send({embed: embed});
    }
	},
};
