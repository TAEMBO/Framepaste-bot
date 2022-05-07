const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		interaction.deferReply();

		let message = interaction.options.getString("wisdom")
		let result;

		switch (message) {
			case "everyone":
				result = {content: 'bingus no trying to loophole', ephemeral: true}
				break
			case "http":
				result = {content: 'bingus no trying to loophole with links', ephemeral: true}
				break
			default:
				result = null
				break
		}

		if(result){
			await interaction.followUp(result)
			await interaction.deleteReply()
		}else{
			interaction.channel.send({content: message})
			await interaction.deleteReply()
		}

	},
	data: new SlashCommandBuilder().setName("say").setDescription("You are the bot").addStringOption((opt)=>opt.setName("wisdom").setDescription("dorime to what computation will bring us").setRequired(true))
};
