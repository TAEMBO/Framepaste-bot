const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
    name: "interactionCreate",
    giveaway: false,
    tracker: false,
    node: false,
    execute: async (client, interaction) => {
        const sugges = ["suggestion-decline", "suggestion-upvote"]
        if(sugges.includes(interaction.customId) && interaction.isButton()){
        const hasVoted = client.votes._content.includes(`${interaction.user.id}: ${interaction.message.id}`)
        // reactions regarding suggestions only happen in the suggestions channel so return if this event didnt originate from the suggestions channel
        if (interaction.channel.id !== client.config.mainServer.channels.suggestions) return;
        let upvotes;
        let downvotes;
        interaction.message.components.forEach((a)=>{
            a.components.forEach((ton)=>{
                if(ton.customId === "suggestion-decline"){
                    downvotes = parseInt(ton.label)
                } else if (ton.customId === "suggestion-upvote"){
                    upvotes = parseInt(ton.label)
                }
            })
        })
        if(hasVoted){
            interaction.reply({embeds: [new MessageEmbed().setDescription("You've already voted!").setColor("#dd2e44").setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({})})], ephemeral: true})
        } else if(interaction.message.embeds[0].author.name=== `${interaction.member.displayName} (${interaction.user.id})`){
            interaction.reply({embeds: [new MessageEmbed().setDescription("You can't vote on your own suggestion!").setColor("#dd2e44").setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({})})], ephemeral: true})
        } else if(interaction.customId === "suggestion-decline"){
            const ee = await parseInt(interaction.component.label) + 1;
            UpdateButtons(upvotes, ee, interaction.message, interaction.user.id)
            interaction.reply({embeds: [new MessageEmbed().setDescription("❌ Downvote recorded!").setColor("#dd2e44").setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({})})], ephemeral: true})
        } else if(interaction.customId === "suggestion-upvote") {
            const ee = await parseInt(interaction.component.label) + 1;
            UpdateButtons(ee, downvotes, interaction.message, interaction.user.id)
            interaction.reply({embeds: [new MessageEmbed().setDescription("✅ Upvote recorded!").setColor("#77b255").setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({})})], ephemeral: true})
        }
        // delete message and dont handle reaction if message is not a suggestion, but a suggestion command
        if (interaction.message.author.id !== client.user.id && message.content.startsWith(client.prefix + 'suggest')) return message.delete();

        const embed = interaction.message.embeds[0];
        async function UpdateButtons(upvotes, downvotes = Number, message, user){
             message.edit({embeds: [message.embeds[0]], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("suggestion-upvote").setLabel(`${upvotes}`), new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("suggestion-decline").setLabel(`${downvotes}`))]});
             await client.votes.addData(`${user}: ${message.id}`).forceSave();
        }
        function changeProperties(newColor, newTitle) {
            if (embed.hexColor === newColor.toLowerCase() && embed.title === newTitle) return;
            embed.setColor(newColor);
            embed.setTitle(newTitle);
            return interaction.message.edit({embeds: [embed]});
        }
        if (upvotes / downvotes >= 15.1) { // breakthrough, 15.1
            return changeProperties('#f6ff00', 'Breakthrough Suggestion:');
        }
        if (upvotes / downvotes >= 10.1) { // fantastic, 10.1
            return changeProperties('#d6dd50', 'Fantastic Suggestion:');
        }
        if (upvotes / downvotes >= 5.1) { // good, 5.1
            return changeProperties('#d4d494', 'Good Suggestion:');
        }
        if (upvotes / downvotes <= 1 / 3) { // bad, 1/3
            return changeProperties('#4E535E', 'Controversial Suggestion:');
        }
        // normal
        return changeProperties('#f7f7f3', 'Suggestion:');
    }
  }
}