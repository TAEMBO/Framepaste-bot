const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		const embed = new client.embed().setTitle("Invites")
	},
	data: new SlashCommandBuilder().setName("invites").setDescription("See how many you or another user have invited to the server.")
};