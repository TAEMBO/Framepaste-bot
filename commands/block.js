const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		if (!client.hasModPerms(client, interaction.member)) return interaction.reply(`You need the **${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
		client.dmForwardBlacklist.addData(interaction.options.getUser("user").id).forceSave();
		interaction.reply({content: `Successfully blocked user ${interaction.options.getUser("user").id}`, allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("block").setDescription("Block user from sending DMs to the bot or ModMail.").addUserOption((opt)=>opt.setName("user").setDescription("The user to block from DMing the bot.").setRequired(true)),
};