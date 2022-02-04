const { Client, Message } = require("discord.js");

module.exports = async (message, client) => {
    if (client.dmForwardBlacklist._content.includes(message.author.id) || message.author.bot) return;
    if (client.games.some(x => x === message.author.tag)) return;
    const channel = client.channels.cache.get(client.config.mainServer.channels.modlogs);
    const fpb = client.guilds.cache.get(client.config.mainServer.id);
    const guildMemberObject = await fpb.members.fetch(message.author.id);
    const memberOfPccs = !!guildMemberObject
    const embed = new client.embed()
        .setTitle('Forwarded DM Message')
        .setDescription(`<@${message.author.id}>`)
        .setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
        .setColor(client.embedColor)
        .addField('Message Content', message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content + '\u200b')
        .setTimestamp(Date.now());
    let messageAttachmentsText = '';
    message.attachments.forEach(attachment => {
        if (!embed.image && ['png', 'jpg', 'webp', 'gif', 'jpeg'].some(x => attachment.name.endsWith(x))) embed.setImage(attachment.url);
        else messageAttachmentsText += `[${attachment.name}](${attachment.url})\n`;
    });
    if (messageAttachmentsText.length > 0) embed.addField('Message Attachments', messageAttachmentsText.trim());
    embed
        .addField('Roles:', guildMemberObject.roles.cache.size > 1 ? guildMemberObject.roles.cache.filter(x => x.id !== client.config.mainServer.id).sort((a, b) => b.position - a.position).map(x => x).join(guildMemberObject.roles.cache.size > 4 ? ' ' : '\n').slice(0, 1024) : 'None')
    channel.send({content: client.config.eval.whitelist.map(x => `<@${x}>`).join(', '), embeds: [embed]});
};