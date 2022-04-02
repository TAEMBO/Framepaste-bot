const Discord = require("discord.js");
module.exports = {
    name: "guildMemberRemove",
    giveaway: false,
    tracker: false,
    frs: false,
    execute: async (client, member) => {
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs)
        if (!client.config.botSwitches.automod) return;
        if (member.guild.id !== client.config.mainServer.id) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`Member Left: ${member.user.tag}`)
            .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
            .addField('🔹 Account Creation Date', `<t:${member.user.createdTimestamp.slice(0, -3)}> - <t:${member.user.createdTimestamp.slice(0, -3)}:R>`)
            .addField('🔹 Join Date', `<t:${member.joinedTimestamp.slice(0, -3)}> - <t:${member.user.joinedTimestamp.slice(0, -3)}:R>`)
            .addField('🔹 Roles', `${member.roles.cache.map(x => x).join(" ")}`)
            .setColor(client.config.embedColorRed)
            .setTimestamp(Date.now())
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
         channel.send({embeds: [embed]});
         delete client.userLevels._content[member.user.id];
    }
}
