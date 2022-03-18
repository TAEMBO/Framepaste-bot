const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply("https://c.tenor.com/Z3yhizAhKRsAAAAC/steven-he-i-will.gif");
	},
	data: new SlashCommandBuilder().setName("sendtojesus").setDescription("Made by ItzDihan7674 (for real again)"),
};