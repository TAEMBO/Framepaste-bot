const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: '<:Tro:945431068079697921>', ephemeral: true})
		interaction.channel.send(interaction.options.getString("word"));
	},
	data: new SlashCommandBuilder().setName("say").setDescription("You are the bot").addStringOption((opt)=>opt.setName("wisdom").setDescription("dorime to what computation will bring us").setRequired(true))
};
