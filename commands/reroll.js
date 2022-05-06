const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: async (client, interaction) => {
        if (!client.hasModPerms(client, interaction.member)) {
            return interaction.reply({content: `You need the <@&${client.config.mainServer.roles.mod}> role to use this command.`, allowedMentions: {roles: false}});
        }
        
        const giveaway = interaction.options.getString("message_id");

        client.giveawaysManager.reroll(giveaway)
            .then(() => {
                interaction.reply('Giveaway rerolled!');
            })
            .catch((e) => {
                interaction.reply(e);
                console.log(e);
            });
    },
    data: new SlashCommandBuilder().setDescription("Rerolls a giveaway").setName("reroll").addStringOption((opt)=>opt.setName("message_id").setDescription("The ID of the giveaway message.").setRequired(true))
}