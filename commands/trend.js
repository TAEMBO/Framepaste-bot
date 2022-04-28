const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    run: (client, interaction) => {
        const embed = new MessageEmbed().setTitle('trend');
        const trend = interaction.options.getString("query");
        if(trend.length < 3) return interaction.reply({content: 'A trend must be a minimum of 3 letters.', allowedMentions: {repliedUser: false}, ephemeral: true});
        const trendmembers = interaction.guild.members.cache.filter(member => member.displayName.toLowerCase().includes(trend)).map(member => member.toString()).join(", ")
        if(!trendmembers){
            embed.addFields({name: trend, value: 'No users follow this trend (bozo)'})
            interaction.reply({embeds: [embed], ephemeral: true, allowedMentions: {repliedUser: false}})
            return;
        }else if(trendmembers.length > 6000){
                return interaction.reply({content: 'This trend is too big', ephemeral: true});
            }else {
                embed.setColor(client.config.embedColor)
                embed.setTitle("Trend")
                embed.addFields({name: trend, value: trendmembers});
                interaction.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }

    },
    data: new SlashCommandBuilder().setName("trend").setDescription("Search for users with a matching username or nickname.").addStringOption((opt)=>opt.setName("query").setDescription("The query for the trend.").setRequired(true)),
    disabled: true
}; 