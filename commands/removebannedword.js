module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
		if (!args[1]) return message.channel.send('You need to include the word to unban.');
		delete client.bannedWords._content[args[1]]
        client.bannedWords.forceSave();
		message.channel.send('Successfully unbanned the word.');
	},
	name: 'removebannedword',
    alias: ['rbw'],
	usage: ['word'],
	description: 'Remove a word from the bannedWords database',
	category: 'Moderation'
};