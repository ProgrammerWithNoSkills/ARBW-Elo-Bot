const sqlite = require('sqlite3'); //sqlite dependencies
const Sequelize = require('sequelize'); //sqlite dependencies

module.exports = {
  //SQL Datastructure
  /*======================================================================*/

   //users database handler
     initUserSequelize() {
        const userSequelize = new Sequelize('userDataBase', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: './databases/users/users.db',    // user database path
        });
     return userSequelize;
    },

   //games database handler
    initGamesSequelize() {
        const gamesSequelize = new Sequelize('gamesDataBase', 'user2', 'password2', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: './databases/games/games.db',    // games database path
        });
      return gamesSequelize;
    },

   //users database structure
    initUserDB(userSequelize) {
        const UserDB = userSequelize.define('userDataBase', {
            userid: {
                type: Sequelize.STRING,
                unique: true,
                defaultValue: 0,
                allowNull: false,
            },

            ign: {
                type: Sequelize.STRING,
                unique: true,
            },

            elo: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            mvp:{
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            gamesWon: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            gamesLost: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            gamesVoided: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            gamesPlayed: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            winstreak: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            strikes: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            rankbanned: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        });
     return UserDB;
    },

    //games database structure
    initGamesDB(gamesSequelize) {
        const GamesDB = gamesSequelize.define('gamesDataBase', {
            team1Player1: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player1ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t1P1Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player2: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player2ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t1P2Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player3: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player3ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t1P3Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player4: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team1Player4ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t1P4Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player1: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player1ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t2P1Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player2: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player2ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t2P2Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player3: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player3ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t2P3Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player4: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            team2Player4ID: {
                type: Sequelize.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            t2P4Delta: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            saved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            MVP1: {
                type: Sequelize.STRING,
                defaultValue: `N/A`,
                allowNull: false,
            },
            MVP2: {
                type: Sequelize.STRING,
                defaultValue: `N/A`,
                allowNull: true,
            },
            MVP3: {
                type: Sequelize.STRING,
                defaultValue: `N/A`,
                allowNull: true,
            },
            wonBy: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            scored: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            scoredBy: {
                type: Sequelize.STRING,
                defaultValue: `N/A`,
            },
            isVoided: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        });
        return GamesDB;
    },
};
