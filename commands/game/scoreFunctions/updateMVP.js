const Sequelize = require('sequelize'); //sqlite dependencies

const utilEmbed = require('../../archive/utilEmbed.js');

module.exports = {
	async updateMVP(message, UserDB, selectedGameData, mvpID, mvpIGN, mvpNum) {

    try {
      const theMVP = await UserDB.findOne( { attributes: [`ign`, `mvp`, `id`], where: Sequelize.or( { userid: mvpID }, { ign: mvpIGN } ) } );

      //check if mvp is not null
      if (theMVP) {

        //check if the player inputted actually played the game
        var playerInGame = false;
        loop1:
          for (var j = 1; j <= 2; j++) {
            loop2:
              for (var i = 1; i <= 4; i++) {
                var player = `team${j}Player${i}`;
                if (selectedGameData[`${player}`] === theMVP.ign) {
                  playerInGame = true;
                  break loop1;
                };
              };
          };

        if (playerInGame) {
          //place MVP in database
          const mvpField = `MVP${mvpNum}`;
          const dbUpdateMVP = await selectedGameData.update( { [`${mvpField}`]: theMVP.ign, where: { id: theMVP.id } } );
					//update times player has become MVP in UserDB
					const updatedMVPTimes = theMVP.mvp + 1;
					const updateMVPTimes = await theMVP.update( { mvp: updatedMVPTimes } );
          return true;

        } else if (!playerInGame) {
          message.channel.send({embed: await utilEmbed.genEmbed(false, `RED`, `The player you inputted for MVP ${mvpNum} did not play that game!`)} );
          return false;
        };

      } else {
        message.channel.send({embed: await utilEmbed.genEmbed(false, `RED`, `The player you inputted for MVP ${mvpNum} does not exist!`)} );
        return false;
      };

    } catch (e) {
        if (e.name === `SequelizeDatabaseError`) {
          message.channel.send({embed: await utilEmbed.genEmbed(false, `RED`, `Did you input the right name for MVP ${mvpNum}?`)})
          return false;
        }
        console.log(e);
        return false;
    };
	},
};
