/* const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    run: async (client, interaction) => {
        const suggestion = interaction.options.getString("suggestion");
        if (interaction.channel.id !== client.config.mainServer.channels.suggestions) {
            return interaction.reply({content: `This command only works in <#${client.config.mainServer.channels.suggestions}>`, allowedMentions: { repliedUser: false }, ephemeral: true});
        }
        if (suggestion.length > 2048) {
            return interaction.reply({content: 'Your suggestion must be less than or equal to 2048 characters in length.', ephemeral: true})
        }
        const embed = new MessageEmbed()
            .setAuthor({name: `${interaction.member.displayName} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ format: 'png', size: 128 })})
            .setTitle(`Suggestion:`)
            .setDescription(suggestion)
            .setFooter({text: 'Read pins for more info'})
            .setTimestamp(Date.now())
            .setColor(client.config.embedColor)
            await interaction.reply({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("suggestion-upvote").setLabel("1"), new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("suggestion-decline").setLabel("1"))]});
    },
    data: new SlashCommandBuilder().setName("suggest").setDescription("Create a suggestion. Only works in <#912591798436761631>.").addStringOption((opt)=>opt.setName("suggestion").setDescription("Your suggestion.").setRequired(true)),
}; */