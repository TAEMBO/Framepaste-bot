module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
		if (!args[1]) return message.channel.send('You need to add a word to ban.');
		client.bannedWords.addData(args.slice(1).join(' ')).forceSave();
		message.channel.send(`Successfully added \`${args.slice(1).join(' ')}\` to bannedWords list`);
	},
	name: 'addbannedword',
    alias: ['abw', 'bannedword'],
	usage: ['word/phrase'],
	description: 'Add a word to the bannedWords database',
	category: 'Moderation'
};