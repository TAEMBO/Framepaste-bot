const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		client.punish(client, interaction, 'warn');
	},
	data: new SlashCommandBuilder().setName("warn").setDescription("Warns a user.").addUserOption((opt)=>opt.setName("member").setDescription("The member to warn.").setRequired(true)).addStringOption((opt)=>opt.setName("reason").setDescription("The reason to warn the user.").setRequired(false))
};