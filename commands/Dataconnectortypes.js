module.exports = {
    run: async (client, message) => {
        const { MessageEmbed } = require("discord.js");

        const dataConnectorsEmbed = new MessageEmbed()
            .setTitle("Data Connector Types")
            .setImage(`https://cdn.discordapp.com/attachments/940726714915495946/944680762563756082/dataimage.png`);
        message.reply({embeds: [dataConnectorsEmbed]})
    },
    name: 'dataconnectors',
    description: 'Data connector types for hard drives',
    category: 'Real Computers',
    alias: ['dc', 'driveconnectors']

};