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
    run: (client, interaction) => {

        const content = interaction.options.getString("content");

        if (!client.hasModPerms(client, interaction.member)) return interaction.reply({
            content: 'You aren\'t allowed to make polls',
            ephemeral: true
        }) 
        
        const inte = await interaction.reply({fetchReply: true, embeds: [new client.embed().setAuthor({name: "This poll expires in 15 minutes."}).setTitle("New Poll.").setColor(client.config.embedColor).setDescription("**my poll name**")], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setStyle("SUCCESS").setLabel("1").setCustomId(`upvate`).setEmoji("<:upvote:708964481413283891>"), new Discord.MessageButton().setStyle("DANGER").setLabel("1").setCustomId("downbad").setEmoji("<:downvote:910416524840423435> "))]})

        const collecctor = inte.createMessageComponentCollector({time: 900000});
        const votes = [];
        collector.on("collect", async (i) => {
            if (votes.includes(i.user.id)) {
                return i.reply({content: 'You already voted', ephemeral: true});
            } else if (i.customId === 'upvate') {
                interaction.update({embeds: [i.message.embeds[0]], components: [new Discord.MessageActionRow().addComponents(i.message.components[0].components[0].setLabel(`${parseInt(i.message.components[0].components[0].label) + 1}`))]});
            } else if (i.customId === 'votedown') {
                interaction.update({embeds: [i.message.embeds[0]], components: [new Discord.MessageActionRow().addComponents(i.message.components[0].components[1].setLabel(`${parseInt(i.message.components[0].components[1].label) + 1}`))]});
        }
        collecctor.on("end", async (ia) => {
            inte.edit({embeds: [inte.embeds[0]], components: [new Discord.MessageActionRow().addComponents(inte.components[0].components[0].forEach((e)=>{e.setDisabled(true)}))]})
        });
      });
    }
}