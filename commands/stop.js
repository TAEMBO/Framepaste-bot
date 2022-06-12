const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder().setName("stop").setDescription("Stops all music playing."),
    run: async(client, interaction) => {
        if(!client.music.getQueue(interaction.guildId)) return interaction.reply({content: "There is no music playing.", ephemeral: true});
        client.music.getQueue(interaction.guildId).destroy();
        interaction.reply({content: "I have left the voice chat."});
    }
}