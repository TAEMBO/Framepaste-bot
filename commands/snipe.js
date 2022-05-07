const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Gets the last deleted message in the channel."),
    run: (client, interaction) => {

        let values = Array.from(client.snipes)

        interaction.channel.reply(typeof values[1].content)

    }
}