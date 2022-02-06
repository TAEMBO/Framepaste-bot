module.exports = {
	run: (client, message, args) => {
		if (!args[1]) return message.channel.send('You need to add a word to ban.');
		message.reply({content: `https://cdn.discordapp.com/emojis/${args[1]}.gif`, allowedMentions: { repliedUser: false }});
	},
	name: 'aemojilink',
    alias: ['ael'],
	usage: ['emoji ID'],
	description: 'Convert an animated emoji to a gif link',
    hidden: true
};