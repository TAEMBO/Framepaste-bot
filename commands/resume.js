const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async(client, interaction) => {
		const queue = client.music.getQueue(interaction.guildId)
		if (!queue) return interaction.reply({content: "There are no songs playing.", ephemeral: true});
		queue.setPaused(false)
        await interaction.reply({content: "Music has been resumed!"})
	},
}