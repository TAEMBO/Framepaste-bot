const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		interaction.reply("https://cdn.discordapp.com/attachments/723158335985025124/785214690678538290/Leave_server_2020_11_08_17_40_41_UTC.mp4");
	},
	data: new SlashCommandBuilder().setName("leave").setDescription("Leave......")
};