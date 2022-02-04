module.exports = {
	run: (client, message, args) => {
		message.reply({content: 'https://dontasktoask.com', allowedMentions: { repliedUser: false }});
	},
	name: 'data',
	alias: ['dontasktoask']
};