const { MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
module.exports = async (client) => {
    const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs)
   client.on("messageDelete", async (msg)=>{
       if(msg.partial) return;
       if(msg.author.bot) return;
       const embed = new client.embed()
           .setTitle("Message Deleted!")
           .setDescription(`<@${msg.author.id}>\nContent:\n\`\`\`\n${msg.content}\n\`\`\`\nChannel: <#${msg.channel.id}>`)
           .setAuthor({name: `Author: ${msg.author.tag} (${msg.author.id})`, iconURL: `${msg.author.displayAvatarURL()}`})
           .setColor(14495300)
           channel.send({embeds: [embed]})
       if (msg.attachments?.first()?.width && ['png', 'jpeg', 'jpg', 'gif'].some(x => msg.attachments.first().name.endsWith(x))) {
           channel.send({files: [msg.attachments?.first()]})
   }})
   client.on("messageUpdate", async (oldMsg, newMsg)=>{
       if(oldMsg.partial) return;
       if(newMsg.partial) return;
       if(oldMsg.author.bot) return;
       const embed = new client.embed()
           .setTitle("Message Edited!")
           .setDescription(`<@${oldMsg.author.id}>\nOld Content:\n\`\`\`\n${oldMsg.content}\n\`\`\`\nNew Content:\n\`\`\`js\n${newMsg.content}\n\`\`\`\nChannel: <#${oldMsg.channel.id}>`)
           .setAuthor({name: `Author: ${oldMsg.author.tag} (${oldMsg.author.id})`, iconURL: `${oldMsg.author.displayAvatarURL()}`})
           .setColor(client.embedColor)
       channel.send({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(`${oldMsg.url}`).setLabel("Jump to message"))]})
   })
   client.on("guildMemberAdd", async (member)=>{
        const embed = new MessageEmbed()
        .setTitle(`Member Joined: ${member.user.tag}`)
        .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
        .addField('🔹 ID and Mention', `ID: ${member.user.id}\nMention: <@${member.user.id}>`)
        .setColor(7844437)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
        channel.send({embeds: [embed]})
   })
   client.on("guildMemberRemove", async (member)=>{
    const embed = new MessageEmbed()
    .setTitle(`Member Left: ${member.user.tag}`)
    .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
    .addField('🔹 Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
    .addField('🔹 ID and Mention', `ID: ${member.user.id}\nMention: <@${member.user.id}>`)
    .addField('🔹 Roles', `${member.roles.cache.map(x => x).join(", ")}`)
    .setColor(14495300)
    .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
    channel.send({embeds: [embed]})
   })
   client.on("messageDeleteBulk", async (messages)=>{
    let text = "";
    messages.forEach((e)=>{
        text += `${e.author.tag}: ${e.content}\n`;
    });
    const embed = new MessageEmbed()
    .setDescription(`\`\`\`${text}\`\`\``)
    .setTitle(`${messages.size} Messages Were Deleted.`)
    .addField("Channel", `<#${messages.first().channel.id}>`)
    .setColor(client.embedColor)
    channel.send({embeds: [embed]})
})
 channel.send(`:warning: Bot restarted :warning:\n${client.config.eval.whitelist.map(x => `<@${x}>`).join(', ')}`)
};
