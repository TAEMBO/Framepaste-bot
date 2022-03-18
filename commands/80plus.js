const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: 'https://www.guru3d.com/index.php?ct=articles&action=file&id=10061', allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("80plus").setDescription("PSU 80+ certification levels"),
	category: 'Real Computers'
};