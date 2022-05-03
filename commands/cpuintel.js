const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		client.cpuCommand(client, interaction, "intel");
	},
	data: new SlashCommandBuilder()
		.setName("cpuintel")
		.setDescription("Finds a intel CPU.")
		.addSubcommand((optt)=>optt
			.setName("help")
			.setDescription("Shows you how to use the command."))
		.addSubcommand((optt)=>optt
			.setName("search").setDescription("Searches the db for the queried intel CPU.")
			.addStringOption((opt)=>opt
				.setName("query").setDescription("The intel CPU to query for.")
				.setRequired(true))
			.addStringOption(options => options
				.setName('options')
				.setDescription('Search options for the commands')
				.addChoice('sl - searches and gives a list and lets you chose from it', 'sl')
				.addChoice('s - searches and gives you a list without the option to chose', 's')
				.addChoice('none - searches only for the specific cpu you put', 'none')
				.setRequired(true)))
};