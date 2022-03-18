const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = { 
	run: (client, interaction) => {
		interaction.reply({content: `https://media.discordapp.net/attachments/873064255690264596/917983590225166346/SSD_1.png`, allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("ssd").setDescription("Shows all types of SSDs.")
};