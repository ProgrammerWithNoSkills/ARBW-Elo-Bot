
module.exports = {
	async checkIfMVP(selectedGameData, playerIGN) {

    for (let i = 1; i <= 3; i++) {
      const mvpField = `MVP${i}`;

      const checkAgainst = selectedGameData[`${mvpField}`];

      //see if player ign is in an MVP field
      if (playerIGN == checkAgainst) {
        return true;
      };
    };

    //if cannot find playerIGN in selectedGameData.MVPs false
    return false;
	},
};
