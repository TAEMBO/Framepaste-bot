const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
		interaction.deferReply();

		let message = interaction.options.getString("wisdom")

		if(client.bannedWords.includes(message.toLowerCase()) || message.includes('http') || message.includes('discord.gg')){
			await interaction.followUp({content: "Bingus no trying to loophole!", ephemeral: true});
			await interaction.deleteReply();
			return;
		}

		await interaction.channel.send({content: message, mentions: []});
		await interaction.deleteReply();

		//log

		let logEmbed = new MessageEmbed()
			.setTitle('Wisdom')
			.setDescription(`User: ${interaction.author.tag}\nsaid: ${message}`)

		client.emit('log', {embeds: [logEmbed]});
	},
	data: new SlashCommandBuilder().setName("say").setDescription("You are the bot").addStringOption((opt)=>opt.setName("wisdom").setDescription("dorime to what computation will bring us").setRequired(true))
};
