const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    run: async (client, message, args) => {
        if (message.guild.id !== client.config.mainServer.id) return message.channel.send(`\`${client.prefix}staff\` doesn't work in this server.`);
        const staff = {
            administrator: await message.guild.roles.fetch(client.config.mainServer.roles.administrator),
            moderator: await message.guild.roles.fetch(client.config.mainServer.roles.moderator),
            trialmoderator: await message.guild.roles.fetch(client.config.mainServer.roles.trialmoderator),
        };
        const admin = await staff.administrator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.developer)).map(e=>`<@${e.user.id}>`).join(",\n") || "None";
        const mod = await staff.moderator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.administrator) && !x.roles.cache.has(client.config.mainServer.roles.developer)).map(e=>`<@${e.user.id}>`).join(",\n") || "None";
        const tm = await staff.trialmoderator.members.map(e=>`<@${e.user.id}>`).join(",\n") || "None";
 
        const embed = new MessageEmbed()
            .setTitle('__Staff Members__')
            .addField(staff.administrator.name, admin)
            .addField(staff.moderator.name, mod)
            .addField(staff.trialmoderator.name, tm)
            .addField("\u200b", "If you want to report someone or need any other moderation help, feel free to message anyone of these people. <@!837407028665254028> (ModMail) can also be used to report someone.")
            .setColor(3971825)
        message.channel.send({embeds: [embed]});
    },
    name: 'staff',
    description: 'Shows all the current staff members',
    cooldown: 10
};