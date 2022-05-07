const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    disabled: true,
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Gets the last deleted message in the channel."),
    run: (client, interaction) => {

        interaction.reply(client.snipes.get(interaction.channel.id).content);

    }
}