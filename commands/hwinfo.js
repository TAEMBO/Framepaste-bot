const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: 'https://www.hwinfo.com/', allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("hwinfo").setDescription("Gives a download link for HWiNFO"),
};