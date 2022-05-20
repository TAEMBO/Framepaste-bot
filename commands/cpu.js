const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		client.cpuCommand(client, interaction, interaction.options.getString("brand"));
	},
	data: new SlashCommandBuilder().setName("cpu")
		.setDescription("searches CPU specs")
		.addSubcommand((optt)=>optt
			.setName("help")
			.setDescription("Shows you how to use the command"))
		.addSubcommand((optt)=>optt
			.setName("search")
			.setDescription("Searches the db for the queried CPU")
			.addStringOption((opt)=>opt
				.setName("brand")
				.setDescription("The brand to filter for")
				.addChoice('Intel', 'intel')
				.addChoice('AMD', 'amd')
				.setRequired(true))
			.addStringOption((opt)=>opt
				.setName("query")
				.setDescription("The CPU to query for.")
				.setRequired(true))
			.addStringOption(options => options
				.setName('options')
				.setDescription('Search options for the commands')
				.addChoice('sl - searches and gives a list', 'sl')
				.addChoice('s - searches and gives you a list to choose from', 's')
				.addChoice('none - searches for a matching CPU\'s specs', 'none')
				.setRequired(true)))
};
