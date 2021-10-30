
module.exports = {
	async calcElo(currentPlayerElo, won, config) {

      //calculate rank of player
      var rank = (currentPlayerElo/100.0).toString().split('.')[0];
      if (currentPlayerElo > config[`eloWinLoss`].maxElo) {
        rank = '_';
      } else if (currentPlayerElo < config[`eloWinLoss`].minElo) {
				rank = 'you should probably quit';
			};

      //calculate new elo of player.
      if (won) {
        var newElo = currentPlayerElo + config[`eloWinLoss`][`${rank}`][`win`];
      } else {
        var newElo = currentPlayerElo - config[`eloWinLoss`][`${rank}`][`loss`];
      };

      return newElo;
	},
};
