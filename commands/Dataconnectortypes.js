const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: async (client, interaction) => {
        const { MessageEmbed } = require("discord.js");

        const dataConnectorsEmbed = new MessageEmbed()
            .setTitle("Data Connector Types")
            .setImage(`https://cdn.discordapp.com/attachments/940726714915495946/944680762563756082/dataimage.png`);
        interaction.reply({embeds: [dataConnectorsEmbed]})
    },
    data: new SlashCommandBuilder().setName("drive_connectors").setDescription("Data connector types for hard drives"),

};