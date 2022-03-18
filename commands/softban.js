const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		client.punish(client, interaction, 'softban');
	},
	data: new SlashCommandBuilder().setName("softban").setDescription("Bans a member, delete their messages from the last 7 days and unbans them.").addUserOption((opt)=>opt.setName("member").setRequired(true).setDescription("The member to softban.")).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for softbanning this user."))
};