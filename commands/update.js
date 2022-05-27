const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    run: async (client, interaction) => {
        if (!client.hasModPerms(client, interaction.member) && !interaction.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)) return interaction.reply({content: `You need the <@&${client.config.mainServer.roles.botdeveloper}> role to use this command.`, allowedMentions: {roles: false}})
        const msg = await interaction.reply({content: "Pulling from repo...", allowedMentions: {repliedUser: false}, fetchReply: true});
        require("child_process").exec("git pull")
        msg.edit({content: "Pulled from repo"});

        const options = interaction.options.getString('options');

        switch (options) {
          case 'ur':
            msg.edit({content: "Restarting..."})
            client.channels.cache.get(client.config.mainServer.channels.modlogs).send({embeds: [new client.embed().setTitle(`**Update and restart issued by ${interaction.user.tag}**`).setColor(client.config.embedColor).setTimestamp()]}).then(async ()=> eval(process.exit(-1)))
            return
          case 'u':
            return;
        }
      },
    data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Pull from GitHub repository to live bot")
    .addStringOption(opt => opt
      .setName('options')
      .setDescription('Restart as well?')
      .addChoices(
        {name: 'Update and restart', value: 'ur'},
        {name: 'Update', value: 'u'})
      .setRequired(true))
};
