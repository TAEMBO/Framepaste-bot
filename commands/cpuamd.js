const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		client.cpuCommand(client, interaction, "amd");
	},
	data: new SlashCommandBuilder().setName("cpuamd").setDescription("Finds a AMD CPU.").addSubcommand((optt)=>optt.setName("help").setDescription("Shows you how to use the command.")).addSubcommand((optt)=>optt.setName("search").setDescription("Searches the db for the queried AMD CPU.").addStringOption((opt)=>opt.setName("query").setDescription("The AMD CPU to query for.").setRequired(true)))
};