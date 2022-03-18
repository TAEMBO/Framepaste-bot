const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply("https://c.tenor.com/mm6gNAyiobUAAAAC/emotional-damage.gif");
	},
	data: new SlashCommandBuilder().setName("damage").setDescription("Made by ItzDihan7674 (for real)"),
};