const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: (client, interaction) => {
        interaction.reply("https://tryitands.ee/")
    },
    data: new SlashCommandBuilder().setName("tryitandsee").setDescription("Try it and see.")
};