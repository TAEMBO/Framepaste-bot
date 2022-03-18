const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
        const embed = new client.embed()
        .setTitle(`Try asking here`)
		.setURL('https://google.com')
        .setColor(client.config.embedColor)
        interaction.reply({embeds: [embed]})
	},
    data: new SlashCommandBuilder().setName("askhere").setDescription("Try asking here!"),
	hidden: true
};