module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		if (args[1]) {
			message.channel.send(`<@${args[1]}> has received an honorary ban!`)
		} else message.channel.send('You recieved an honorary ban!')
	},
	name: 'b&',
	usage: ['userID'],
	hidden: true
};