const { Client, interaction, MessageEmbed, ClientVoiceManager } = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    run: async (client, interaction) => {
        const staff = {
            administrator: await interaction.guild.roles.fetch(client.config.mainServer.roles.admin),
            moderator: await interaction.guild.roles.fetch(client.config.mainServer.roles.mod),
            trialmoderator: await interaction.guild.roles.fetch(client.config.mainServer.roles.minimod),
            helper: await interaction.guild.roles.fetch(client.config.mainServer.roles.helper)
        };
        const admin = await staff.administrator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.owner)).map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const mod = await staff.moderator.members.filter(x=>!x.roles.cache.has(client.config.mainServer.roles.admin)).map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const tm = await staff.trialmoderator.members.map(e=>`<@${e.user.id}>`).join("\n") || "None";
        const helper = await staff.helper.members.map(e=>`<@${e.user.id}>`).join("\n") || "None";
 
        const embed = new MessageEmbed()
            .setTitle('__Staff Members__')
            .setDescription(`<@&${client.config.mainServer.roles.admin}>\n${admin}\n\n<@&${client.config.mainServer.roles.mod}>\n${mod}\n\n<@&${client.config.mainServer.roles.minimod}>\n${tm}\n\n<@&${client.config.mainServer.roles.helper}>\n${helper}`)
            .setColor(client.config.embedColor)
        interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
    },
    data: new SlashCommandBuilder().setName("staff").setDescription("Shows all the current staff members.")
};