module.exports = {
    name: "messageDelete",
    giveaway: false,
    tracker: false,
    node: false,
    execute: async (client, msg) => {
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
        const dbEntry = client.starboard._content[msg.id];
        if(dbEntry?.e) {
        (await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
        delete client.starboard._content[msg.id];
        } else {
        if (!client.config.botSwitches.automod) return;
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
    }
   } 
  }
}