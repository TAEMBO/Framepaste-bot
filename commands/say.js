const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
		await interaction.deferReply();
		await interaction.editReply('Loading...')

		const message = interaction.options.getString("wisdom");
		let reply = interaction.options.getString("reply");

		if(client.bannedWords._content.includes(message.replace(" ", "").toLowerCase()) || message.replace(" ", "").includes('http') || message.replace(" ", "").includes('discord.gg')){
			await interaction.followUp({content: "Bingus no trying to loophole!", ephemeral: true});
			await interaction.deleteReply();
			return;
		}

		if(typeof await interaction.channel.messages.fetch(reply) === "object"){
			interaction.channel.messages.get(reply).reply({content: message, allowedMentions: { roles: false, users: false, mention_everyone: false }})
		}else{
			await interaction.channel.send({content: message, allowedMentions: { roles: false, users: false, mention_everyone: false }});
		}
		await interaction.deleteReply();

		client.emit('log', {embeds: [new MessageEmbed().setTitle('Wisdom').setDescription(`**User:** ${interaction.user.tag}\n**said:** ${message}`).setColor(client.config.embedColor)]});
	},
	data: new SlashCommandBuilder().setName("say")
		.setDescription("You are the bot")
		.addStringOption((opt)=>opt
			.setName("wisdom")
			.setDescription("dorime to what computation will bring us")
			.setRequired(true))
		.addStringOption(opt => opt
			.setName('reply')
			.setDescription('Put the id of the message you want to reply.'))
};
