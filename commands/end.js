const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: async (client, interaction) => {
        if (interaction.guild.id !== client.config.mainServer.id) {
            return interaction.reply({content: 'Wrong server.', allowedMentions: { repliedUser: false }})
        }
        if (!client.hasModPerms(client, interaction.member)) {
            return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, allowedMentions: {roles: false}});
        }

        const giveaway = client.giveawaysManager.giveaways.find((g) => g.messageID === interaction.options.getString("message_id"));

        if (!giveaway) {
            return interaction.reply(':boom: Hm. I can\'t seem to find a giveaway for `' + interaction.options.getString("message_id") + '`.');
        }
        client.giveawaysManager.edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
        })
            .then(() => {
                interaction.reply('Giveaway will end in less than ' + (client.giveawaysManager.options.updateCountdownEvery / 1000) + ' seconds...');
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with interaction ID ${giveaway.messageID} has already ended.`)) {

                    interaction.followUp('This giveaway has already ended!');

                } else {
                    console.error(e);
                    interaction.followUp('An error occurred...');
                }
            });
    },
    data: new SlashCommandBuilder().setName("end").setDescription("Ends a giveaway").addStringOption((opt)=>opt.setName("message_id").setDescription("The ID of the Giveaway Message.").setRequired(true))
};