
module.exports = {
    name: 'fake',
    description: 'Fake a game. Strictly for debug only',
    args: true,
    usage: '<game/user>',
    cooldown: 5,
    aliases: [],
    permissions: 'ADMINISTRATOR',
    async execute(message, args, UserDB, GamesDB) {

    //generate random chars function
    function gen(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

//generate random nums function
function genNumber(length) {
        var result  = [];
        var characters = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
            };
        return result.join('');
        }

        const arg = args[0];

        if (arg === `game`) {
            try {
                //fake new entry in database
			    const team1Player1 = await gen(4);
			    const team1Player2 = await gen(4);
			    const team1Player3 = await gen(4);
			    const team1Player4 = await gen(4);
			    const team2Player1 = await gen(4);
			    const team2Player2 = await gen(4);
			    const team2Player3 = await gen(4);
			    const team2Player4 = await gen(4);
			    const team1Player1ID = await genNumber(18);
			    const team1Player2ID = await genNumber(18);
			    const team1Player3ID = await genNumber(18);
			    const team1Player4ID = await genNumber(18);
			    const team2Player1ID = await genNumber(18);
			    const team2Player2ID = await genNumber(18);
			    const team2Player3ID = await genNumber(18);
			    const team2Player4ID = await genNumber(18);

            var tag = await GamesDB.create({
                team1Player1: team1Player1,
                team1Player2: team1Player2,
                team1Player3: team1Player3,
                team1Player4: team1Player4,
                team2Player1: team2Player1,
                team2Player2: team2Player2,
                team2Player3: team2Player3,
                team2Player4: team2Player4,
			    team1Player1ID: team1Player1ID,
			    team1Player2ID: team1Player2ID,
			    team1Player3ID: team1Player3ID,
			    team1Player4ID: team1Player4ID,
			    team2Player1ID: team2Player1ID,
			    team2Player2ID: team2Player2ID,
			    team2Player3ID: team2Player3ID,
			    team2Player4ID: team2Player4ID,
                });
			    for (var j = 1; j <= 2; j++) {
				    for (var i = 1; i <= 4; i++) {
					    var playerID = `team${j}Player${i}ID`;
					    var playername = `team${j}Player${i}`;
				        //fake new entry in database
					    var tag2 = await UserDB.create({
						    userid: eval(playerID),
						    ign: eval(playername),
						    elo: await genNumber(3),
						    gamesWon: await genNumber(3),
						    gamesLost: await genNumber(3),
						    gamesVoided: await genNumber(2),
						    gamesPlayed: await genNumber(4),
			        });
			    }
		    }
		    console.log(`User  ${tag.ign} faked.`);
	        return console.log(`Game ${tag.id} faked.`);
		    }
        catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                console.error(e);
                return message.reply('blurb suck');
                }
            console.error(e);
            return message.reply('Something went wrong with faking data.');
            }
        } else if (arg === `user`) {
            try {
                //fake new entry in database
                const tag = await UserDB.create({
                userid: await genNumber(18),
                ign: await gen(12),
                elo: await genNumber(3),
                gamesWon: await genNumber(3),
                gamesLost: await genNumber(3),
                gamesVoided: await genNumber(2),
                gamesPlayed: await genNumber(4),
                });
                return console.log(`User  ${tag.ign} faked.`);
            }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                    console.error(e);
                    return message.reply('blurb suck');
                }
            console.error(e);
            return message.reply('Something went wrong with faking data.');
            }
        }
    },
};
