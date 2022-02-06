module.exports = {
	run: (client, message, args) => {
		if (!args[1]) return message.channel.send('You need to add a word to ban.');
		message.reply({content: `https://cdn.discordapp.com/emojis/${args[1]}.png`, allowedMentions: { repliedUser: false }});
	},
	name: 'semojilink',
    alias: ['sel'],
	usage: ['emoji ID'],
	description: 'Convert an static emoji to a png link',
    hidden: true
};