const utilEmbed = require('../commands/archive/utilEmbed.js');
const config = require('../config.json');
const index = require('../index.js');

module.exports = async (client, message) => {
    try {
        const cooldown = new Set();
        let prefix = config.prefix;

        let msg = message.content.split(/\s+/g);
        let args = msg.slice(1);
        let command = client.commands.get(msg[0].slice(prefix.length)) || client.commands.get(client.aliases.get(msg[0].slice(prefix.length)));

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        //breaks due to utilEmbed
        if (message.channel.type === `dm`) {
            return message.reply({embed: await utilEmbed.genEmbed(false, `BLUE`, '**I can\'t execute commands inside DMs idot**') });
        }

        //ignore messages sent by players with "Rank Banned"
        if (message.member.roles.cache.has(config.roleIDs[`Rank Banned`])) {
            return message.reply({embed: await utilEmbed.genEmbed(false, `PINK`, `😹🤣🤣<@${message.member.id}🥵, **😹👍 you're rank banned and can\'t use commands. LOL?🤣🤣**`)});
        };

        //command permission control
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply({embed: await utilEmbed.genEmbed(false, `BLUE`, '**no perm lol**')});
            }
        }

        //command arguments control
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                return message.channel.send(reply);
            }
        }
        if (command.argLength) {
        if (args.length != command.argLength) {
            let reply = `You didn't provide the right number of arguments, ${message.author}!
                        \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            return message.channel.send(reply);
        }
        };

        cooldown.add(message.author.id); //add author to cooldown Set
        setTimeout(() => {
            // Removes the user from the set after specified time.
            cooldown.delete(message.author.id);
        }, 5000);

        //this is borked but IDK why
        command.execute(message, args, index.databases.userDB, index.databases.gamesDB, command);

        return;
    } catch (e) {
        return console.log(e);
    };

}
