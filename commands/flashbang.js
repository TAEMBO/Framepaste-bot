const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply('https://www.computerhope.com/issues/pictures/discord-theme-select.jpg')
	},
	data: new SlashCommandBuilder().setName("flashbang").setDescription("Hinder your enemies in chat with this.")
};