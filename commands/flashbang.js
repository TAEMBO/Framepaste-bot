module.exports = {
	run: (client, message, args) => {
        message.delete()
		message.channel.send('https://www.computerhope.com/issues/pictures/discord-theme-select.jpg')
	},
	name: 'flashbang',
    alias: ['fb'],
	description: 'Hinder your enemies in chat with this',
    hidden: true
};