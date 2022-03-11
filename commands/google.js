module.exports = {
	run: (client, message, args) => {
		message.delete();
		if (!args[1]) return message.channel.send('You need to add something to search.').then(m => setTimeout(() => m.delete(), 6000));
        message.channel.send(`https://www.google.com/search?q=${args.slice(1).join('+')}`)
	},
	name: 'google',
	description: 'Generate a Google search URL',
	usage: ['search term'],
	hidden: true
};