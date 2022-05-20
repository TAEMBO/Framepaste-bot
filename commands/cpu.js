const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		const chooseBrand = interaction.options.getString("brand");
		
		let brand = '';
		
		switch (chooseBrand) {
			case 'i':
				brand = "intel";
				return;
			case 'a':
				brand = "amd";
				return;
		
		client.cpuCommand(client, interaction, brand);
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
				.addChoice('Intel', 'i')
				.addChoice('AMD', 'a')
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
