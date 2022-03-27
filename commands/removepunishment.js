const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		client.unPunish(client, interaction, 'ban');
	},
	data: new SlashCommandBuilder().setName("unpunish").setDescription("Unpunishes a user.").addIntegerOption((opt)=>opt.setName("case_id").setDescription("The ID of the punishment to remove.").setRequired(true)).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for removing the punishment.").setRequired(false))
};