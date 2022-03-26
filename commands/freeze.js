const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		if (interaction.member.roles.cache.has(client.config.mainServer.roles.moderator)) {
            // credits to Skippy for this
            const role = interaction.guild.roles.everyone;
            const perms = role.permissions.toArray()

            const newPerms = perms.filter((perm) => perm !== 'SEND_MESSAGES');
            await role.edit({ permissions: newPerms })
            interaction.reply('Froze server')
        
        } else {
            interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, allowedMentions: {roles: false}})
        }
	},
    data: new SlashCommandBuilder().setName("freeze").setDescription("Lock the server for casuals")
};
