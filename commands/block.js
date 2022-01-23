module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
		if (!args[1]) return message.channel.send('You need to add a user or user ID.');
		const userid = message.mentions.users.first()?.id || args[1];
		client.dmForwardBlacklist.addData(userid).forceSave();
		message.channel.send('Successfully blocked user ' + userid);
	},
	name: 'block',
	usage: ['user id / mention'],
	description: 'Block user from sending DMs to the bot or ModMail. Used as a punishment for users who abuse the aforementioned features.',
	shortDescription: 'Block user from DMing bot.',
	category: 'Moderation'
};