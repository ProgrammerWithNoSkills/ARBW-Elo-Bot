

module.exports = {
	async createGameTextChannel(gamesCategory, user, playerIDs, gameID) {
      try {
      await user.guild.channels.create(`game-${gameID}`, {
        type: `text`,
        topic: `Discussion of teams channel for Game-#${gameID}`,
        parent: gamesCategory,

        permissionOverwrites: [
          {
            id: playerIDs[0],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[1],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[2],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[3],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[4],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[5],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[6],
            allow: `VIEW_CHANNEL`
          },
          {
            id: playerIDs[7],
            allow: `VIEW_CHANNEL`
          },
        ],

				position: 0,
      });
      return true;

    } catch (e) {
      console.log(e);
      return false;
    };
	},

	async createPregameVoiceChannel(gamesCategory, user, gameID, playerIDs) {
		try {
			await user.guild.channels.create(`game-${gameID}-pickingteams`, {
				type: `voice`,
				bitrate: 64000,
				userLimit: 8,
				parent: gamesCategory,

				permissionOverwrites: [
          {
            id: playerIDs[0],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[1],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[2],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[3],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[4],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[5],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[6],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
          {
            id: playerIDs[7],
            allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
          },
        ],

				position: 0,
			});
			return true;
		} catch (e) {
			console.log(e)
			return false;
		};
	},

	async createTeam1VoiceChannel(gamesCategory, user, gameID, team1) {
		try {
			await user.guild.channels.create(`game-${gameID}-team1`, {
				type: `voice`,
				bitrate: 32000,
				userLimit: 4,
				parent: gamesCategory,

				permissionOverwrites: [
					{
						id: team1[0].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team1[1].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team1[2].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team1[3].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
				],

				position: 0,
			});
			return true;
		} catch (e) {
			console.log(e)
			return false;
		};
	},

	async createTeam2VoiceChannel(gamesCategory, user, gameID, team2) {
		try {
			await user.guild.channels.create(`game-${gameID}-team2`, {
				type: `voice`,
				bitrate: 32000,
				userLimit: 4,
				parent: gamesCategory,

				permissionOverwrites: [
					{
						id: team2[0].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team2[1].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team2[2].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
					{
						id: team2[3].id,
						allow: `VIEW_CHANNEL`,
						allow: `CONNECT`
					},
				],

				position: 1,
			});
			return true;
		} catch (e) {
			console.log(e)
			return false;
		};
	},

};
