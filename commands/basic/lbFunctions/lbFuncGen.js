const Discord = require('discord.js');

module.exports = {

//extract from database
/*======================================================================*/
    async extract(message, arg, UserDB) {
        try {
            const tagList = await UserDB.findAll({
              attributes: [`ign`, `${arg}`],
              order: [[`${arg}`, `DESC`]],
              raw: true,
              limit: 20
            });
            return tagList;
            
        } catch (e) {
            if (e.name === `SequelizeDatabaseError`) {
              message.reply("That leaderboard does not exist!");
              return false;
            }
          console.log(e)
          message.reply("There was an error extracting data.");
          return false;
        };
    },

//push to arrays
/*======================================================================*/
    async arrayPush(tagList, arg) {
        arr1 = [], arr2 = [], arrBeautify = [];

        for (var i = 0; i < tagList.length; i++) {
      /*  console.log(tagList[i]);
          console.log(arg); */
          arr1.push(tagList[i].ign);
          arr2.push(tagList[i][`${arg}`]);
          arrBeautify.push('-');
        };
				//console.log(`array1: ${arr1}`);
        return arr1;
    },
    async arrayPush2() {
				//console.log(`array2: ${arr2}`);
    		return arr2;
    },
    async arrayPush3() {
				//console.log(`array3: ${arrBeautify}`);
    		return arrBeautify;
    },

};
