
module.exports = {
	async updateDisplayName(message, UserDB, userUUID) {

    //extract elo from database
    try {
      const fromDB = await UserDB.findOne( { attributes: [`elo`, `ign`], where: { userid: userUUID } } );
      if (fromDB == null) {
        await message.reply(`that user does not have records in the database, please contact staff if you think this is a mistake.`);
        return false;
      };
    } catch (e) {
      console.log(e);
      return false;
    };

    //find user in Guild
    const user = await message.guild.members.cache.find(userFind => userFind.id === userUUID);
    if (user == null) {
      await message.reply(`that user is not in the server.`);
      return false;
    };

    //update user's nickname
    await user.setNickname(`[${fromDB.elo}] ${fromDB.ign}`);

    return fromDB;
	},
};
