const { Client, Message, MessageEmbed, ClientVoiceManager } = require("discord.js");

module.exports = {
    run: async (client, message, args) => {
        if (message.guild.id !== client.config.mainServer.id) return message.reply({content: `\`${client.prefix}staff\` doesn't work in this server.`, allowedMentions: { repliedUser: false }});
        const staff = {
            administrator: await message.guild.roles.fetch(client.config.mainServer.roles.administrator),
            moderator: await message.guild.roles.fetch(client.config.mainServer.roles.moderator),
            trialmoderator: await message.guild.roles.fetch(client.config.mainServer.roles.trialmoderator),
            helper: await message.guild.roles.fetch(client.config.mainServer.roles.helper)
        };
        const admin = await staff.administrator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.owner)).map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const mod = await staff.moderator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.administrator)).map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const tm = await staff.trialmoderator.members.map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const helper = await staff.helper.members.map(e=>`<@${e.user.id}>`).join("\n") || "None";
 
        const embed = new MessageEmbed()
            .setTitle('__Staff Members__')
            .setDescription(`<@&${client.config.mainServer.roles.administrator}>\n${admin}\n\n<@&${client.config.mainServer.roles.moderator}>\n${mod}\n\n<@&${client.config.mainServer.roles.trialmoderator}>\n${tm}\n\n<@&${client.config.mainServer.roles.helper}>\n${helper}`)
            .setColor(client.embedColor)
        message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
    },
    name: 'staff',
    description: 'Shows all the current staff members',
    cooldown: 10
};