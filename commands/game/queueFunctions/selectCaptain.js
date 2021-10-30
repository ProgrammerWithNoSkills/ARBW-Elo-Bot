const roleExchange = require('./gens/roleExchange.js'); //exchanging roles functions

module.exports = {
	async selectCaptains(playersInGame) {

      let captains = [];

      for (let i = 0; i < 2; i++) { //select 2 captains
        await roleExchange.addCaptain(playersInGame[i]);
        captains.push(playersInGame[i]);
      };

      return captains;
	},
};
