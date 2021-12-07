module.exports = {
	run: async (client, message, args) => {
		if (message.member.hasPermission('ADMINISTRATOR')) {

            const role = message.guild.roles.everyone;
            const query = args[0].toLowerCase()
            const perms = role.permissions.toArray()

            if (query === "end") {
                perms.push("SEND_MESSAGES")
                await role.edit({ permissions: perms });
                message.channel.send('Unlocked channels')
            } else {
                const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
                await role.edit({ permissions: newPerms })
                message.channel.send('Locked down channels')
            }
        } else {
            message.reply('you do not have permission to use the lockdown command')
        }
	},
	name: 'lockdown',
	description: `Lock all channels that aren't moderation based (e.g. #mod-logs)`,
	usage: ['?end'],
	category: 'Moderation'
};