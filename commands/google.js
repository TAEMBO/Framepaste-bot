const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		let content = `https://www.google.com/search?q=${new URLSearchParams(interaction.options.getString("query")).split(" ").join("+")}`
		if(content.substr(-1) === "="){
		content = content.slice(0, content.lenght-1)
		}
        interaction.reply({content})
	},
	data: new SlashCommandBuilder().setName("google").setDescription("Googles something.").addStringOption((opt)=>opt.setName("query").setDescription("What to search for.").setRequired(true))
};
