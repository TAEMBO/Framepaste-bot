const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    run: async ( interaction, client, Discord ) => {
        if(!client.hasModPerms(client, interaction.member)) return interaction.reply({contetn: "You don't have permission to use this command!"});
        const subCmd = interaction.options.getSubcommand();
        if(subCmd === "start"){
        const winners = interaction.options.getInteger("winners");
        if(winners < 0) return interaction.reply({content: "You may not have less than 0 winners dumbass.", ephemeral: true})
        const prize = interaction.options.getString("prize");
        const length = interaction.options.getString("length");
        client.giveaway.create(interaction, client, prize, length, winners);
        } else if(subCmd === "reroll"){
        const id = interaction.options.getString("giveaway");
        const giveaway = await client.giveaway.get(id);
        if (!giveaway) return interaction.editReply({content: '<:ohno:833150939275722782> That giveaway could not be found. Make sure you are using the giveaway ID or message ID of the giveaway.'});
        const channel = await interaction.guild.channels.cache.get(giveaway.channel);
        const message = await channel.messages.fetch(giveaway.message);
        if (!message) return interaction.editReply({content: "That giveaway doesn't exist"});
        const entriz = await client.giveaway.getEntry(id);
        client.giveaway.roll(message, giveaway, entriz);
        }
    },
    data: new SlashCommandBuilder().setName(`giveaway`).setDescription(`A Subcommand Of Giveaway Things!`).addSubcommand((optt)=>optt.setName("start").setDescription("Starts a giveaway!").addStringOption((opt) => opt.setName("prize").setDescription("What is the prize.").setRequired(true)).addStringOption((opt) => opt.setName("length").setDescription("How long is the giveaway.").setRequired(true)).addIntegerOption((opt) => opt.setName("winners").setDescription("How many winners for the giveaway.").setRequired(true))).addSubcommand((optt)=>optt.setName("reroll").setDescription("Rerolls or ends a giveaway").addStringOption((opt)=>opt.setName("id").setDescription("The ID of the giveaway.").setRequired(true)))
};


