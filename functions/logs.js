const { MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
module.exports = async (client) => {
    const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs)
   client.on("messageDelete", async (msg)=>{
       if (msg.partial) return;
       if (msg.author.bot) return;
       if (msg.guild.id !== client.config.mainServer.id) return;
       const embed = new client.embed()
           .setTitle("Message Deleted!")
           .setDescription(`<@${msg.author.id}>\nContent:\n\`\`\`\n${msg.content}\n\`\`\`\nChannel: <#${msg.channel.id}>`)
           .setAuthor({name: `Author: ${msg.author.tag} (${msg.author.id})`, iconURL: `${msg.author.displayAvatarURL()}`})
           .setColor(14495300)
           .setTimestamp(Date.now())
           channel.send({embeds: [embed]})
       if (msg.attachments?.first()?.width && ['png', 'jpeg', 'jpg', 'gif'].some(x => msg.attachments.first().name.endsWith(x))) {
           channel.send({files: [msg.attachments?.first()]})
   }})
   client.on("messageUpdate", async (oldMsg, newMsg)=>{
       if (oldMsg.partial) return;
       if (newMsg.partial) return;
       if (newMsg.content === oldMsg.content) return;
       if (oldMsg.author.bot) return;
       if (oldMsg.guild.id !== client.config.mainServer.id) return;
       const embed = new client.embed()
           .setTitle("Message Edited!")
           .setDescription(`<@${oldMsg.author.id}>\nOld Content:\n\`\`\`\n${oldMsg.content}\n\`\`\`\nNew Content:\n\`\`\`js\n${newMsg.content}\n\`\`\`\nChannel: <#${oldMsg.channel.id}>`)
           .setAuthor({name: `Author: ${oldMsg.author.tag} (${oldMsg.author.id})`, iconURL: `${oldMsg.author.displayAvatarURL()}`})
           .setColor(client.embedColor)
           .setTimestamp(Date.now())
       channel.send({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(`${oldMsg.url}`).setLabel("Jump to message"))]})
   })
   client.tracker.on("guildMemberAdd", async (member, type, invite)=>{
       if (member.guild.id !== client.config.mainServer.id) return;
       if (type == "unknown") {

        const embed = new MessageEmbed()
           .setTitle(`Member Joined: ${member.user.tag}`)
           .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
           .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
           .addField("🔹Invite Data:", `I couldn't find out how they joined!`)
           .setColor(7844437)
           .setTimestamp(Date.now())
           .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
        channel.send({embeds: [embed]})

    } else {
       const embed = new MessageEmbed()
           .setTitle(`Member Joined: ${member.user.tag}`)
           .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
           .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
           .addField("🔹Invite Data:", `Invite: \`${invite.code}\`\nCreated by: **${invite.inviter.username}**`)
           .setColor(7844437)
           .setTimestamp(Date.now())
           .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
        channel.send({embeds: [embed]})
}
   })
   client.on("guildMemberRemove", async (member)=>{
       if (member.guild.id !== client.config.mainServer.id) return;
       const embed = new MessageEmbed()
           .setTitle(`Member Left: ${member.user.tag}`)
           .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
           .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
           .addField('🔹 Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
           .addField('🔹 Roles', `${member.roles.cache.map(x => x).join(" ")}`)
           .setColor(14495300)
           .setTimestamp(Date.now())
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
    .setTimestamp(Date.now())
    channel.send({embeds: [embed]})
})
 channel.send(`:warning: Bot restarted :warning:\n${client.config.eval.whitelist.map(x => `<@${x}>`).join(' ')}`)
};