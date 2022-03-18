const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: 'https://dontasktoask.com', allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("data").setDescription("Don't ask to ask.")
};