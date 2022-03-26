const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		const content = `https://www.google.com/search?q=${interaction.options.getString("query").split(" ").join("+")}`
        interaction.reply({content})
	},
	data: new SlashCommandBuilder().setName("google").setDescription("Googles something.").addStringOption((opt)=>opt.setName("query").setDescription("What to search for.").setRequired(true))
};
