module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing gsm because', err.message));
		message.channel.send("get self moderated");
	},
	name: 'gsm',
	hidden: true
};