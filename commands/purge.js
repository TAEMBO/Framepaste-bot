const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		const amount = interaction.options.getInteger("amount");
		const user = interaction.options.getUser("user");
		if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.mod).id}> role to use this command.`, allowedMentions: {roles: false}});
		if (amount > 100) return interaction.reply({content: 'You can only delete 100 messages at once. This is a Discord API limitation.', allowedMentions: { repliedUser: false }});

        let messagesArray = [];

		if(user){
			let messagesArrayNotDefinitive = [];
			messagesArrayNotDefinitive.push(await interaction.channel.messages.fetch({ limit: amount }));

				messagesArrayNotDefinitive.forEach(message => {
				if(message.author.id === user.id){
					messagesArray.push(message);
				}
			});
		}else{
			messagesArray.push(await interaction.channel.messages.fetch({ limit: amount }));
		}

		await interaction.channel.bulkDelete(messagesArray);

	},
	data: new SlashCommandBuilder().setName("purge").setDescription("Purges messages in a channel.").addIntegerOption((opt)=>opt.setName("amount").setDescription("The amount of messages to purge.").setRequired(true)).addUserOption((opt)=>opt.setName("user").setDescription("The user to purge messages from.").setRequired(false))
};