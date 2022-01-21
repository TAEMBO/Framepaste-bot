module.exports = {
	run: (client, message, args) => {
		message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
		if (!args[1]) {
			message.channel.send('Your honorary ban has been revoked!')
		} else if (args[1] === '@everyone') {
			return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1] === '@here') {
			 return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1] === 'everyone') {
			return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1] === 'here') {
			 return message.channel.send(`<@${message.author.id}> bingus no trying to loophole`).then(x => setTimeout(() => x.delete(), 6000))
		} else if (args[1]) {
			message.channel.send(`<@${args[1]}> had their honorary ban revoked!`)}
	},
	name: 'unb&',
	usage: ['userID'],
	hidden: true
};