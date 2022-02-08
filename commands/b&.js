module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		
		let member = args(1).toString().replace(/[\\<>@#&!']/g, "")
		
		if (!args[1]) {
			message.channel.send('You received an honorary ban!')
		} else if (args[1] === '@everyone' || '@here' || 'everyone' || 'here') {
			return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1]) {
			message.channel.send(`<@${member}> has received an honorary ban!`)}
	},
	name: 'b&',
	usage: ['userID'],
	hidden: true
};
