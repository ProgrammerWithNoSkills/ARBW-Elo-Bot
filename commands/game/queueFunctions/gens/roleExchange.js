const config = require('../../../../config.json'); //config file

module.exports = {
	async addQueuing(user) {
    try {
      await user.roles.add(config.roleIDs.Queuing);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    };
	},

  async addInGameRemoveQueuing(user) {
    try {
      await user.roles.add(config.roleIDs[`In Game`]);
      await user.roles.remove(config.roleIDs[`Queuing`]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    };
  },

  async addCaptain(user) {
    try {
      await user.roles.add(config.roleIDs.Captain);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    };
  },


};
