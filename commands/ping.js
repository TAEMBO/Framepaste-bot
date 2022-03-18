const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = { 
    run: async (client, interaction) => {
        const msg = await interaction.reply({content: "Pinging...", allowedMentions: {repliedUser: false}, fetchReply: true});
        const time = msg.createdTimestamp - interaction.createdTimestamp; msg.edit({content: `Ping: \`${time}\`ms`});
    },
    data: new SlashCommandBuilder().setName("ping").setDescription("Get's the bot's latency.")
};