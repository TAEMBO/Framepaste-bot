const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	run: (client, interaction) => {

		const userToPunish = interaction.options.getUser('member')

		if(interaction.user.id === userToPunish.id){
			interaction.reply({content: "You can't kick yourself", ephemeral: true})
			return;
		}

		client.punish(client, interaction, 'kick');
	},
	data: new SlashCommandBuilder().setDescription("Kicks a user from the server.").setName("kick").addUserOption((opt)=>opt.setName("member").setDescription("The user to kick from the server.").setRequired(true)).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for kicking the user.").setRequired(false))
};
