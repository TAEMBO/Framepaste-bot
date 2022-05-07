const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Gets the last deleted message in the channel."),
    run: (client, interaction) => {

        interaction.channel.send(typeof client.snipes)

    }
}