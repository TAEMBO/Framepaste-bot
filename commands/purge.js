module.exports = {
	run: async (client, message, args) => {
		if (message.guild.id !== client.config.mainServer.id) return message.reply('Wrong server.');
		const amount = parseInt(args[1]);
		if (!client.hasModPerms(client, message.member)) return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }});
		if (!amount) return message.reply({content: 'You need to specify an amount of messages to delete.', allowedMentions: { repliedUser: false }});
		message.delete().catch();
		if (amount > 100) return message.reply({content: 'You can only delete 100 messages at once. This is a Discord API limitation.', allowedMentions: { repliedUser: false }});
		const deleted = await message.channel.bulkDelete(amount + 1).catch(err => message.channel.send('Something went wrong while deleting messages.' + err.message));
		message.channel.send(`Deleted **${deleted.size - 1}** messages.`).then(x => setTimeout(() => x.delete(), 4000));
	},
	name: 'purge',
	description: 'Delete many messages from a channel.',
	category: 'Moderation',
	usage: ['amount']
};