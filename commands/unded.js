const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: "https://tenor.com/view/the-dancing-dorito-i-revive-this-chat-dance-gif-14308244"});
	},
	data: new SlashCommandBuilder().setName("unded").setDescription("Unded chat.")
};