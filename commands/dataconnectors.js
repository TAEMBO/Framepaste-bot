module.exports = {
    run: async (client, message) => {
        const { MessageEmbed, MessageAttachment } = require("discord.js");
        const image = await new MessageAttachment("./media/Connectortypes.png", "dataimage");
        const dataConnectorsEmbed = new MessageEmbed().setTitle("Data Connector Types").setImage(`attachment://${image.name}`);
        message.reply({embeds: [dataConnectorsEmbed], files: [image]})
    },
    name: 'dataconnectors',
    description: 'Data connector types for hard drives',
    category: 'Real Computers',
    alias: ['dc', 'driveconnectors']

};

