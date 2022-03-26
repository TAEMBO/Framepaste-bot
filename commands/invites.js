const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: async (client, interaction) => {
		const user = interaction.options.getUser("member") ?? interaction.user;
		const invitz = await interaction.guild.invites.fetch();
		const invitez = invitz.filter(x=>x.inviterId===user.id).map(x=>x.uses);
		const invites = invitez.length !== 0 ? invitez?.reduce((partialSum, a) => partialSum + a) : 0;
		const embed = new client.embed().setTitle("Invites").setDescription(`${user.id === interaction.user.id ? "You have" : `<@${user.id}> has`} ${invites} invites.`).setColor(client.config.embedColor);
		interaction.reply({embeds: [embed]})
	},
	data: new SlashCommandBuilder().setName("invites").setDescription("See how many you or another user have invited to the server.").addUserOption((opt)=>opt.setName("member").setDescription("View another users invites").setRequired(false))
}