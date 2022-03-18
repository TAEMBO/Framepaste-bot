const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		client.punish(client, interaction, 'ban');
	},
    data: new SlashCommandBuilder().setName("ban").setDescription("Bans a user from the guild!").addUserOption((opt)=>opt.setName("member").setDescription("The member you would like to ban.").setRequired(true)).addStringOption((opt)=>opt.setName("time").setDescription("The time for the ban.").setRequired(false)).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for banning the user.").setRequired(false)),
	category: 'Moderation'
};