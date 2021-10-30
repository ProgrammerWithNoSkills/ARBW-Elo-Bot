const Discord = require("discord.js");

module.exports = {
    async addPlayerToQueue(message) {

        const guildChannelCache = message.guild.channels.cache;
        const guildRoleCache = message.member.guild.roles.cache;

        const Queue1 = guildChannelCache.find(channel => channel.name === 'Queue #1');
        const Queue2 = guildChannelCache.find(channel => channel.name === 'Queue #2');
        const queuing = guildRoleCache.find(role => role.name === 'Queuing');

        message.member.voice.setChannel(Queue1);

        message.guild.channels.cache.filter(c => c.name === 'Queue #1').forEach(voicechannel => {
            voicechannel.members.forEach(m => {
                try {
                    const waitingInQueue = m.voice.member.displayName.split(' ')[1];
                    console.log(waitingInQueue);
                    var queue = [waitingInQueue];
                    console.log(queue);
                    const enteringQueue = message.member.displayName.split(' ')[1];
                    console.log(enteringQueue);
                    queue.push(enteringQueue);
                    message.reply('you are now queuing!');
                    message.member.roles.add(queuing);

                    return queue;
                } catch (e) {
                    message.channel.send("Something went wrong")
                    return console.log(e);
                }
            });
        });
    },
};
