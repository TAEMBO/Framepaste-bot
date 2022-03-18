const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		client.cpuCommand(client, interaction, "intel");
	},
	data: new SlashCommandBuilder().setName("cpuintel").setDescription("Finds a intel CPU.").addSubcommand((optt)=>optt.setName("help").setDescription("Shows you how to use the command.")).addSubcommand((optt)=>optt.setName("search").setDescription("Searches the db for the queried intel CPU.").addStringOption((opt)=>opt.setName("query").setDescription("The intel CPU to query for.").setRequired(true)))
};