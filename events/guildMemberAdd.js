const Discord = require("discord.js");
module.exports = {
    name: "guildMemberAdd",
    giveaway: false,
    tracker: false,
    frs: false,
    execute: async (client, member) => {
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
        if (member.partial) return;
        const evadingCase = client.punishments._content.find(punishment => {
            if (punishment.type !== "mute") return false;
            if (punishment.member !== member.user.id) return false;
            if (punishment.expired) return false;
            if (punishment.endTime < Date.now()) return false;
            return true;
        });
        
        if (evadingCase) {
            client.punishments.addPunishment("ban", member, { reason: `mute evasion (Case #${evadingCase.id})` }, client.user.id);
        } else {
        if (!client.config.botSwitches.automod) return;
        if (member.guild.id !== client.config.mainServer.id) return;
        const oldInvites = client.invites;
        const newInvites = await member.guild.invites.fetch();
        const usedInvite = newInvites.find(inv => oldInvites.get(inv.code)?.uses < inv.uses);
        newInvites.forEach(inv => client.invites.set(inv.code, {uses: inv.uses, creator: inv.inviter.id}));
        if (!usedInvite) {
 
         const embed = new Discord.MessageEmbed()
            .setTitle(`Member Joined: ${member.user.tag}`)
            .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
            .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
            .addField("🔹Invite Data:", `I couldn't find out how they joined!`)
            .setColor(client.config.embedColorGreen)
            .setTimestamp(Date.now())
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
         channel.send({embeds: [embed]})
 
     } else {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Member Joined: ${member.user.tag}`)
            .setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
            .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
            .addField("🔹Invite Data:", `Invite: \`${usedInvite.code}\`\nCreated by: **${usedInvite.inviter.tag}**`)
            .setColor(client.config.embedColorGreen)
            .setTimestamp(Date.now())
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
         channel.send({embeds: [embed]})
        }
    }
    }
}