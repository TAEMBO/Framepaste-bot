module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
		if (!args[1]) return message.channel.send('You need to add a word to whitelist.');
		client.whitelistWords.addData(args[1]).forceSave();
		message.channel.send('Successfully whitelisted word.');
	},
	name: 'whitelistword',
    alias: ['wlw', 'whitelist'],
	usage: ['word'],
	description: 'Add a word to the whitelistWords database',
	category: 'Moderation'
};