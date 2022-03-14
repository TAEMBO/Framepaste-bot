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
            .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
            .addField('🔹 Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
            .addField('🔹 Roles', `${member.roles.cache.map(x => x).join(" ")}`)
            .setColor(client.config.embedColorRed)
            .setTimestamp(Date.now())
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
         channel.send({embeds: [embed]});
         delete client.userLevels._content[member.user.id];
    }
}