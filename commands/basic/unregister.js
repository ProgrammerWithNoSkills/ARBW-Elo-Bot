const config = require('../../config.json');

module.exports = {

    name: 'unregister',
    description: 'Unregister with =unregister',
    args: true,
    argLength: 1,
    usage: '<ign/@>',
    aliases: [`unreg`, `unrg`],
    permissions: 'ADMINISTRATOR',

//function
/*==================================================================*/
    async execute(message, args, UserDB) {
      const person = await message.guild.members.fetch( args[0].replace(/[<!@>]/g, `` ) )
        || await message.guild.members.fetch(args[0].replace(/[^a-zA-Z0-9 ]/g, ``));

        try {
          if (await person.roles.cache.some(r => r.id === config.roleIDs[`Registered`])) {

              //discord code
              await person.roles.add(config.roleIDs[`Unregistered`]);
              await person.roles.remove(config.roleIDs[`Registered`]);
              await person.setNickname(person.user.username);

              //destroy user is database
              const rowCount = await UserDB.destroy({ where: { userid: person.id } });
              if (!rowCount) return message.reply('That user ID did not exist.');

              message.reply(`You have unregistered <@${person.id}>`);
              return;
            } else {
                  message.reply(`That person is already unregistered.`);
                  return;
              };
          } catch (e) {
              console.error(e);
              message.reply('Something went wrong with removing from the database.');
              return;
          }
      },
};
