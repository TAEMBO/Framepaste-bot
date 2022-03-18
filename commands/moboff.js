const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: 'https://cdn.discordapp.com/attachments/778848112588095559/873406468483862528/20210807_102414.gif', allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("moboff").setDescription("Shows a GIF of each motherboard form factor")
};