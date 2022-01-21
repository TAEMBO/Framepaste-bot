module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		if (args[1]) {
			message.channel.send(`<@${args[1]}> had their honorary ban revoked!`)
		} else message.channel.send('Your honorary ban has been revoked!')
	},
	name: 'unb&',
	usage: ['userID'],
	hidden: true
};