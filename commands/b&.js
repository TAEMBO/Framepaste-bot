module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		if (!args[1]) {
			message.channel.send('Your received an honorary ban!')
		} else if (args[1] === '@everyone') {
			return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1] === '@here') {
			 return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
        } else if (args[1] === 'everyone') {
			return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
	    } else if (args[1] === 'here') {
			 return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1]) {
			message.channel.send(`<@${args[1]}> hasreceived an honorary ban!`)}
	},
	name: 'b&',
	usage: ['userID'],
	hidden: true
};