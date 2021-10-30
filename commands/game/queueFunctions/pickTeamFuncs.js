const config = require('../../../config.json');

module.exports = {

  //split args function
  async argIsolate(commandMessage) {
    return commandMessage.content.slice(config.prefix.length).trim().split(/ +/);
  },

};
