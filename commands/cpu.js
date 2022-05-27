const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		client.cpuCommand(client, interaction, interaction.options.getString("brand"));
	},
	data: new SlashCommandBuilder().setName("cpu")
		.setDescription("Search CPU specs")
		.addSubcommand((optt)=>optt
			.setName("help")
			.setDescription("Shows you how to use the command"))
		.addSubcommand((optt)=>optt
			.setName("search")
			.setDescription("Searches CPUs")
			.addStringOption((opt)=>opt
				.setName("brand")
				.setDescription("The brand to filter for")
				.addChoices(
					{name: 'Intel', value: 'intel'},
					{name: 'AMD', value: 'amd'})
				.setRequired(true))
			.addStringOption((opt)=>opt
				.setName("query")
				.setDescription("The CPU(s) to search for")
				.setRequired(true))
			.addStringOption(options => options
				.setName('options')
				.setDescription('Search options')
				.addChoices(
					{name: 'Search a list you can choose from', value: 's'},
					{name: 'Search for specific CPU specs', value: 'none'})
				.setRequired(true)))
};
