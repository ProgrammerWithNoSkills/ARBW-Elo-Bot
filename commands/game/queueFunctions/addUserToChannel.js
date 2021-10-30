
module.exports = {
	async addToChannel(user, channel) {

      try {
        await user.voice.setChannel(channel); //set given user's voice channel

        let qArray = [];
        for (let [snowflake, guildMember] of channel.members) {
          qArray.push(guildMember); //push all members in the VC prior
        }

        return qArray;

      } catch (e) {
        console.log(e);
        return false;
      };
	},
};
