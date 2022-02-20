const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "messageDeleteBulk",
    giveaway: false,
    tracker: false,
    execute: async (client, messages) => {
        console.log("messages" + messages)
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
         if (!client.config.botSwitches.automod) return;
         let text = "";
         messages.forEach((e)=>{
             text += `${e.author.tag}: ${e.content}\n`;
         });
         const embed = new MessageEmbed()
         .setDescription(`\`\`\`${text}\`\`\``.slice(0, 4100))
         .setTitle(`${messages.size} Messages Were Deleted.`)
         .addField("Channel", `<#${messages.first().channel.id}>`)
         .setColor(client.embedColor)
         .setTimestamp(Date.now())
         channel.send({embeds: [embed]})
        
    }
}