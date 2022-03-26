const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: async (client, interaction) => {
        if (!client.hasModPerms(client, interaction.member)) {
            return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, allowedMentions: {roles: false}});
        }
        
        const giveaway = client.giveawaysManager.giveaways.find(x=>x.id===interaction.options.getString("message_id"));

        if (!giveaway) {
            return interaction.reply(':boom: Hm. I can\'t seem to find a giveaway for `' + interaction.options.getString("message_id") + '`.');
        }

        client.giveawaysManager.reroll(giveaway.messageID)
            .then(() => {
                interaction.reply('Giveaway rerolled!');
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with interaction ID ${giveaway.messageID} has not ended.`)) {
                    interaction.followUp('This giveaway has not ended!');
                } else {
                    console.error(e);
                    interaction.followUp('An error occurred...');
                }
            });
    },
    data: new SlashCommandBuilder().setDescription("Rerolls a giveaway").setName("reroll").addStringOption((opt)=>opt.setName("message_id").setDescription("The ID of the Giveaway Message.").setRequired(true))
}