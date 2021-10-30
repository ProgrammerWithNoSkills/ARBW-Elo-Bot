const config = require('../../../config.json');

module.exports = {
	async checkRankUp(currentPlayerElo, updatedElo) {

			//isolate first numbers of the elo
			var currentEloRank = (currentPlayerElo/100.0).toString().split('.')[0];
			var updatedEloRank = (updatedElo/100.0).toString().split('.')[0];
			if (updatedEloRank > config.eloWinLoss[`maxElo`]) {
				return false;
			}

			let rankUpOrDown = ``;

			if (currentEloRank == updatedEloRank) {
				return false;
			};

      //check if user has ranked up.
      try {
				//make into int so can compare
        const currentEloRankInt = await parseInt(currentEloRank);
				const updatedEloRankInt = await parseInt(updatedEloRank);

				if (currentEloRankInt < updatedEloRankInt) {
					rankUpOrDown = `UP`;
				} else if (currentEloRankInt > updatedEloRankInt) {
					rankUpOrDown = `DOWN`;
				};

				const package = [rankUpOrDown, currentEloRankInt, updatedEloRankInt];
				return package;

      } catch (e) {
        console.log(e);
        return `fail`;
      };
	},
};
