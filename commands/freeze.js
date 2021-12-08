module.exports = {
	run: async (client, message, args) => {
		if (message.member.hasPermission('ADMINISTRATOR')) {

            const role = message.guild.roles.everyone;
            const perms = role.permissions.toArray()

            const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
            await role.edit({ permissions: newPerms })
            message.channel.send('Locked down channels')
        
        } else {
            message.reply('you do not have permission to use this command')
        }
	},
	name: 'freeze',
	description: `Lock the server for casuals`,
	category: 'Moderation'
};
