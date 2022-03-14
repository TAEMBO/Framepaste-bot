module.exports = {
	run: async (client, message, args) => {
        const embed = new client.embed()
        .setTitle(`Bandwidth calculator`)
		.setURL('https://k.kramerav.com/support/bwcalculator.asp')
		.setImage('https://media.discordapp.net/attachments/873056491660263454/940345417143578724/unknown.png')
        .setColor(client.config.embedColor)
        message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
	},
	name: 'cable',
	alias: ['bandwidth', 'hdmi'],
	category: 'Real Computers',
	description: 'Shows the bandwidth for HDMI and DisplayPort'
};