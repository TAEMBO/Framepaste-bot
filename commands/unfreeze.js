module.exports = {
    run: async (client, message, args) => {
        if (message.member.roles.cache.has(client.config.mainServer.roles.moderator)) {
            // credits to Skippy for this
            const role = message.guild.roles.everyone;
            const perms = role.permissions.toArray()

            perms.push("SEND_MESSAGES")
            await role.edit({ permissions: perms });
            message.reply('Unfroze server')     
            
         } else {
            message.reply(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`)
        }
    },
    name: 'unfreeze',
    description: `Unlock the server for casuals`,
    category: 'Moderation'
};