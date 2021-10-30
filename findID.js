const Discord = require('discord.js');

module.exports = {
    prefix: "=",
    //remove these two after merging with main
    botToken: "NTA2MDM0NjgxNTc4MjU4NDUy.W9V_hQ.BmscUN0v5X3APcb3Bf-nAAeRO70",
    hypixelAPIToken: "0fba9464-8fbb-4e90-925c-83fc7ddc9867",

    async idFind(guildSet) {
        //catagory
        let Games = "851410058699997215";

        //channels
        let Prequeue = message.guild.channels.cache.find(channel => channel.name === "Prequeue").id;
        let Queue1 = message.guild.channels.cache.find(channel => channel.name === "Queue1").id;
        let Queue2 = message.guild.channels.cache.find(channel => channel.name === "Queue2").id;
        let GamesAbortedLogging = message.guild.channels.cache.find(channel => channel.name === "GamesAbortedLogging").id;
        let GameScreenshots = message.guild.channels.cache.find(channel => channel.name === "GameScreenshots").id;
        let GameStartLogging = message.guild.channels.cache.find(channel => channel.name === "GameStartLogging").id;
        let VoidLogging = message.guild.channels.cache.find(channel => channel.name === "VoidLogging").id;
        let MiscLogging = message.guild.channels.cache.find(channel => channel.name === "MiscLogging").id;

        //roles
        let Scorer = message.guild.roles.cache.find(role => role.name === 'Scorer');
        let Screensharer = message.guild.roles.cache.find(role => role.name === 'Screensharer');
        let Registered = message.guild.roles.cache.find(role => role.name === 'Registered');
        let Unregistered = message.guild.roles.cache.find(role => role.name === 'Unregistered');
        let Queuing = message.guild.roles.cache.find(role => role.name === 'Queuing');
        let InGame = message.guild.roles.cache.find(role => role.name === 'In Game');
        let Captain = message.guild.roles.cache.find(role => role.name === 'Captain');
        let RankBanned = message.guild.roles.cache.find(role => role.name === 'Rank Banned');
        let Frozen = message.guild.roles.cache.find(role => role.name === 'Frozen');

        //elo ranks
        eloWinLoss: {
            const negativeTwo = {
                role: "836756627465568286",
                win: 35,
                loss: 10
            };

            const negativeOne = {
                role: "836756627465568286",
                win: 35,
                loss: 10
            };

            const negativeZero = {
                role: "836756627465568286",
                win: 35,
                loss: 10
            };

            const zero = {
                role: "848469747804536842",
                win: 30,
                loss: 15
            };

            const one = {
                role: "847835960933875742",
                win: 25,
                loss: 15
            };

            const two = {
                role: "847836025337151508",
                win: 25,
                loss: 15
            };

            const three = {
                role: "847836074800709653",
                win: 25,
                loss: 20
            };

            const four = {
                role: "847836135077314561",
                win: 25,
                loss: 20
            };

            const five = {
                role: "847836295899906058",
                win: 20,
                loss: 20
            };

            const six = {
                role: "847836633931972658",
                win: 20,
                loss: 25
            };

            const seven = {
                role: "847836732472295522",
                win: 20,
                loss: 25
            };

            const eight = {
                role: "847836821517369414",
                win: 15,
                loss: 25
            };

            const nine = {
                role: "847836941071810561",
                win: 15,
                loss: 30
            };

            const ten = {
                role: "847837027557834782",
                win: 15,
                loss: 30
            };

            const eleven = {
                role: "847837114028130356",
                win: 15,
                loss: 30
            };

            const twelve = {
                role: "847837204776484924",
                win: 15,
                loss: 35
            };

            const blank = {
                role: "847837204776484924",
                win: 15,
                loss: 35
            };

            const imagine = {
                role: "836756627465568286",
                win: 100,
                loss: 10000
            };

            maxElo = 1299;
            minElo = -300;
        }
    }
};
