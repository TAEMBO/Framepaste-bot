const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Gets the last deleted message in the channel."),
    run: (client, interaction) => {

        let values = Array.from(client.snipes.values())

        interaction.channel.reply(values.toString())

    }
}