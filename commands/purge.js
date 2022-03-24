const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		if (interaction.guild.id !== client.config.mainServer.id) return interaction.reply('Wrong server.');
		const amount = interaction.options.getInteger("amount");
		if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, allowedMentions: {roles: false}});
		if (amount > 100) return interaction.reply({content: 'You can only delete 100 messages at once. This is a Discord API limitation.', allowedMentions: { repliedUser: false }});
		const deleted = await interaction.channel.bulkDelete(amount + 1).catch(err => interaction.reply('Something went wrong while deleting messages.' + err.interaction));
		interaction.reply(`Deleted **${deleted.size - 1}** messages.`).then(x => setTimeout(() => interaction.deleteReply(), 4000));
	},
	data: new SlashCommandBuilder().setName("purge").setDescription("Purges messages in a channel.").addIntegerOption((opt)=>opt.setName("amount").setDescription("The amount of messages to purge.").setRequired(true))
};