const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: (client, interaction) => {
        if (!client.hasModPerms(client, interaction.member) && !interaction.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)) return interaction.reply({content: `You need the **${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`, allowedMentions: {repliedUser: false}})
        const msg = await interaction.reply({content: "Pulling from repo..."});
        require("child_process").exec("git pull").then(async ()=> msg.edit({content: "Pulled from repo"}));
      },
    data: new SlashCommandBuilder().setName("update").setDescription("Pull from GitHub repository to live bot")
};