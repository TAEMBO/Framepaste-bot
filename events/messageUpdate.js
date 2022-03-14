const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = {
    name: "messageUpdate",
    giveaway: false,
    tracker: false,
    frs: false,
    execute: async (client, oldMsg, newMsg) => {
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
        if (!client.config.botSwitches.automod) return;
        if (oldMsg.partial) return;
        if (newMsg.partial) return;
        if (client.bannedWords._content.some(word => newMsg.content.toLowerCase().includes(word)) && newMsg.guild.id === client.config.mainServer.id && newMsg.channel.id !== client.config.mainServer.channels.modchat) newMsg.delete();
        if (newMsg.content === oldMsg.content) return;
        if (oldMsg.author.bot) return;
        if (oldMsg.guild.id !== client.config.mainServer.id) return;
        const embed = new client.embed()
            .setTitle("Message Edited!")
            .setDescription(`<@${oldMsg.author.id}>\nOld Content:\n\`\`\`\n${oldMsg.content}\n\`\`\`\nNew Content:\n\`\`\`js\n${newMsg.content}\n\`\`\`\nChannel: <#${oldMsg.channel.id}>`)
            .setAuthor({name: `Author: ${oldMsg.author.tag} (${oldMsg.author.id})`, iconURL: `${oldMsg.author.displayAvatarURL()}`})
            .setColor(client.config.embedColor)
            .setTimestamp(Date.now())
        channel.send({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(`${oldMsg.url}`).setLabel("Jump to message"))]})
    }
}