const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "messageDeleteBulk",
    giveaway: false,
    tracker: false,
    frs: false,
    execute: async (client, messages) => {
        console.log("messages" + messages)
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
         if (!client.config.botSwitches.automod) return;
         let text = "";
         messages.forEach((e)=>{
             text += `${e.author.tag}: ${e.content}\n`;
         });
         const embed = new MessageEmbed()
         .setDescription(`\`\`\`${text}\`\`\``.slice(0, 3900))
         .setTitle(`${messages.size} Messages Were Deleted.`)
         .addFields({name: 'Channel', value: `<#${messages.first().channel.id}>`})
         .setColor(client.config.embedColor)
         .setTimestamp(Date.now())
         channel.send({embeds: [embed]})
        
    }
}