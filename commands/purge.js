const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		const amount = interaction.options.getInteger("amount");
		const user = interaction.options.getUser("user");
		if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.mod).id}> role to use this command.`, allowedMentions: {roles: false}});
		if (amount > 100) return interaction.reply({content: 'You can only delete 100 messages at once. This is a Discord API limitation.', allowedMentions: { repliedUser: false }});

        let messagesArray = [];

		if(user){
			await interaction.channel.messages.fetch({ limit: amount }).then(messages => {
				if(messages.id === user.id){
					messagesArray.push(messages.id);
					interaction.channel.send('added 1 to array');
				}
			})
		}else{
			await interaction.channel.messages.fetch({ limit: amount }).then(messages => {
				messages.forEach(message => {
					messagesArray.push(message.id);
				});
			});
		}

		await interaction.channel.bulkDelete(messagesArray);
		await interaction.reply(`Successfully deleted ${amount} messages.`);

	},
	data: new SlashCommandBuilder().setName("purge").setDescription("Purges messages in a channel.").addIntegerOption((opt)=>opt.setName("amount").setDescription("The amount of messages to purge.").setRequired(true)).addUserOption((opt)=>opt.setName("user").setDescription("The user to purge messages from.").setRequired(false))
};