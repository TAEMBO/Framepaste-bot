const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async(client, interaction) => {
        const queue = client.music.getQueue(interaction.guildId);
        if(!queue) return interaction.reply({content: "There is no music playing.", ephemeral: true});
		queue.skip()
        await interaction.reply({embeds: [new MessageEmbed().setColor(client.config.embedColor).setDescription(`${queue.current.title} has been skipped!`).setThumbnail(queue.current.thumbnail).setColor(client.config.embedColor)]});
	},
}