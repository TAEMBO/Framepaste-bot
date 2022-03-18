const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
        const embed = new client.embed()
        .setTitle(`Bandwidth calculator`)
		.setURL('https://k.kramerav.com/support/bwcalculator.asp')
		.setImage('https://media.discordapp.net/attachments/873056491660263454/940345417143578724/unknown.png')
        .setColor(client.config.embedColor)
        interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
	},
	data: new SlashCommandBuilder().setName("cable").setDescription("Shows the bandwidth for HDMI and DisplayPort."),
	category: 'Real Computers',
};