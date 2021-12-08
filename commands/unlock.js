module.exports = {
    run: async (client, message, args) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {

            const role = message.guild.roles.everyone;
            const perms = role.permissions.toArray()

            perms.push("SEND_MESSAGES")
            await role.edit({ permissions: perms });
            message.channel.send('Unlocked channels')     
            
         } else {
            message.reply('you do not have permission to use this command')
        }
    },
    name: 'lockdown',
    description: `Lock @ everyone send message permissions`,
    category: 'Moderation'
};