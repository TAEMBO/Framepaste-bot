const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {

		const userToPunish = interaction.options.getUser('member')

		if(interaction.user.id === userToPunish.id){
			interaction.reply({content: "You can't soft ban yourself", ephemeral: true})
			return;
		}

		client.punish(client, interaction, 'softban');
	},
	data: new SlashCommandBuilder().setName("softban").setDescription("Bans a member, delete their messages from the last 7 days and unbans them.").addUserOption((opt)=>opt.setName("member").setRequired(true).setDescription("The member to softban.")).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for softbanning this user."))
};
