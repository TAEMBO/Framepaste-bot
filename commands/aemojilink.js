const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: `https://cdn.discordapp.com/emojis/${interaction.options.getString("emoji")}.gif`, allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("aemojilink").setDescription("Converts an animated emoji to a gif link").addStringOption((opt)=>opt.setName("emoji").setDescription("The emoji.").setRequired(true)),
	hidden: true
};