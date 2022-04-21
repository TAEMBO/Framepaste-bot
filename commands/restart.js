const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
  run: (client, interaction) => {
    if (!client.hasModPerms(client, interaction.member) && !interaction.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.botdeveloper).id}> role to use this command.`, allowedMentions: {roles: false}})
    interaction.reply("Restarting...").then(async ()=> eval(process.exit(-1)))
  },
  data: new SlashCommandBuilder().setName("restart").setDescription("Restarts the bot.")
};
