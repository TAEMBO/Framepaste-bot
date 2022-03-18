const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: `https://cdn.discordapp.com/emojis/${interaction.options.getString("emoji")}.png`, allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("semojilink").setDescription("Converts a static emoji to a png.").addStringOption((opt)=>opt.setName("emoji").setDescription("The emoji to convert.").setRequired(true))
};