const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	run: (client, interaction) => {
		client.punish(client, interaction, 'kick');
	},
	data: new SlashCommandBuilder().setDescription("Kicks a user from the server.").setName("kick").addUserOption((opt)=>opt.setName("member").setDescription("The user to kick from the server.").setRequired(true)).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for kicking the user.").setRequired(false))
};