const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
		await interaction.deferReply();
		await interaction.editReply('Loading...')

		const message = interaction.options.getString("wisdom");

		if(client.bannedWords._content.includes(message.replace(" ", "").toLowerCase()) || message.replace(" ", "").includes('http') || message.replace(" ", "").includes('discord.gg')){
			await interaction.followUp({content: "Bingus no trying to loophole!", ephemeral: true});
			await interaction.deleteReply();
			return;
		}

		await interaction.channel.send({content: message, allowedMentions: { parse: [] }});
		await interaction.deleteReply();

		client.emit('log', {embeds: [new MessageEmbed().setTitle('Wisdom').setDescription(`**User:** ${interaction.user.tag}\n**said:** ${message}`).setColor(client.config.embedColor)]});
	},
	data: new SlashCommandBuilder().setName("say").setDescription("You are the bot").addStringOption((opt)=>opt.setName("wisdom").setDescription("dorime to what computation will bring us").setRequired(true))
};
