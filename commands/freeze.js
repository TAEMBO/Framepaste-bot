module.exports = {
	run: async (client, message, args) => {
		if (message.member.roles.cache.has(client.config.mainServer.roles.moderator)) {
            // credits to Skippy for this
            const role = message.guild.roles.everyone;
            const perms = role.permissions.toArray()

            const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
            await role.edit({ permissions: newPerms })
            message.reply('Froze server')
        
        } else {
            message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }})
        }
	},
	name: 'freeze',
    alias: ['shut', 'lock'],
	description: `Lock the server for casuals`,
	category: 'Moderation'
};
