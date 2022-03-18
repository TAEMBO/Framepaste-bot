const {SlashCommandBuilder} = require("@discordjs/builders"); 
module.exports = {
    run: async (client, interaction) => {
        interaction.reply('https://cdn.discordapp.com/attachments/696911040700481637/824518099877101619/video1.mp4');
    },
    data: new SlashCommandBuilder().setName("trol").setDescription("Block the trols.")
};