const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		if (client.memberCount_LastGuildFetchTimestamp < Date.now() - 60000) {
			await interaction.guild.fetch();
			client.memberCount_LastGuildFetchTimestamp = Date.now();
		}
		interaction.reply({content: `**${interaction.guild.name}** has **${interaction.guild.memberCount.toLocaleString()}** members.`, allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("member_count").setDescription("View the guilds member count!")
};