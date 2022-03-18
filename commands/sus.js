const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		// 20% of the time responds with a ping
		if (Math.random() < 0.2){ interaction.reply(interaction.member.toString() + (Math.random() < 0.2 ? ' is a :b:ingus' : ' is sus!')); } else { interaction.deferReply({ephemeral: true}); };
	},
	data: new SlashCommandBuilder().setName("sus").setDescription("GuildMember deserialization with binary tree inversion.")
};