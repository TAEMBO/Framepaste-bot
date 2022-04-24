const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll')
        .addStringOption(content => content
            .setName('content')
            .setDescription('The poll content')
            .setRequired(true)),
    run: async (client, interaction) => {

        const content = interaction.options.getString("content");

        if (!client.hasModPerms(client, interaction.member)) return interaction.reply({
            content: 'You aren\'t allowed to make polls',
            ephemeral: true
        }) 
        
        const inte = await interaction.reply({fetchReply: true, embeds: [new client.embed().setFooter({text: "This poll expires in 15 minutes."}).setDescription(`${content}`).setColor(client.config.embedColor).setAuthor({name: `Poll created by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SUCCESS").setLabel("0").setCustomId(`upvate`).setEmoji("<:upvote:708964481413283891>"), new Discord.MessageButton().setStyle("DANGER").setLabel("0").setCustomId("downbad").setEmoji("<:downvote:910416524840423435> "))]})

        const collecctor = inte.createMessageComponentCollector({time: 900000});
        const votes = [];
        collecctor.on("collect", async (i) => {
            if (votes.includes(i.user.id)) {
                return i.reply({content: 'You already voted', ephemeral: true});
            } else if (i.customId === 'upvate') {
                i.update({embeds: [i.message.embeds[0]], components: [new Discord.MessageActionRow().addComponents(i.message.components[0].components[0].setLabel(`${parseInt(i.message.components[0].components[0].label) + 1}`), i.message.components[0].components[1])]});
                votes.push(i.user.id);
            } else if (i.customId === 'downbad') {
                i.update({embeds: [i.message.embeds[0]], components: [new Discord.MessageActionRow().addComponents(i.message.components[0].components[0], i.message.components[0].components[1].setLabel(`${parseInt(i.message.components[0].components[1].label) + 1}`))]});
                votes.push(i.user.id);
            }
        collecctor.on("end", async (ia) => {
            inte.edit({embeds: [inte.embeds[0]], components: [new Discord.MessageActionRow().addComponents(inte.components[0].components.forEach((e)=>{e.setDisabled(true)}))]})
        });
      });
    }
}
