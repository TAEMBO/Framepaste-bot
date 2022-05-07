const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    disabled: true,
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Gets the last deleted message in the channel.")
        .addSubcommand(get => get
            .setName("get")
            .setDescription("Gets the last deleted message in the channel."))
        .addSubcommand(enable => enable
            .setName("enable")
            .setDescription("Enables snipe for your user."))
        .addSubcommand(disable => disable
            .setName("disable")
            .setDescription("Disables snipe for your user.")),
    run: (client, interaction) => {

        interaction.reply(client.snipes.get(interaction.channel.id).content);

    }
}