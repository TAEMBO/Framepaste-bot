const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = { 
    run: async (client, interaction) => {
        const msg = await interaction.reply({content: "Pinging...", allowedMentions: {repliedUser: false}, fetchReply: true});
        msg.edit({content: `Ping: \`${msg.createdTimestamp - interaction.createdTimestamp}\`ms`});
    },
    data: new SlashCommandBuilder().setName("ping").setDescription("Get's the bot's latency.")
};
