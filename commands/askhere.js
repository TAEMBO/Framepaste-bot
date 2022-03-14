module.exports = {
	run: (client, message, args) => {
		message.delete();
        const embed = new client.embed()
        .setTitle(`Try asking here`)
		.setURL('https://google.com')
        .setColor(client.config.embedColor)
        message.channel.send({embeds: [embed]})
	},
	name: 'askhere',
    alias: ['ah'],
	hidden: true
};