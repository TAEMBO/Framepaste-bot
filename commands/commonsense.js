const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		const embed = new client.embed()
			.setTitle('Using common sense.')
			.setImage("https://childdevelopment.com.au/wp-content/uploads/bfi_thumb/shape-sorter-2xjqawyb3s7qeuj8vk2jml3ym5m6yrbslxqx94shln1zpdhaa.jpg")
			.setColor(client.config.embedColor)
		interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("commonsense").setDescription("common sense."),
    hidden: true
};