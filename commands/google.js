const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
        interaction.reply(`https://www.google.com/search?q=${new URLSearchParams(interaction.options.getString("query")).toString()}`)
	},
	data: new SlashCommandBuilder().setName("google").setDescription("Googles something.").addStringOption((opt)=>opt.setName("query").setDescription("What to search for.").setRequired(true))
};