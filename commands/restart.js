module.exports = {
  run: (client, message) => {
    if (!client.hasModPerms(client, message.member) && !message.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)) return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`, allowedMentions: {repliedUser: false}})
    message.reply("Restarting...").then(async ()=> eval(process.exit(-1)))
  },
    name: 'restart',
    description: 'Restarts the bots',
    hidden: true
};