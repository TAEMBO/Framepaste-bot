const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
        const embed = new client.embed()
        .setTitle(`Don't ask to ask.`)
        .setDescription('Don\'t expect someone to take responsibility for your question before they know what it is. Ask first. Someone will respond if they can and want to help.')
        .setColor(client.config.embedColor)
        .setFooter({text: 'cloned from discord.gg/buildapc', iconURL: 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp'});
        interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
	},
	data: new SlashCommandBuilder().setName("ask").setDescription("links to don't ask to ask")
};
