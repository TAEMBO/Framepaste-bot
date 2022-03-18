const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the **${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }});
		const subCmd = interaction.options.getSubcommand();
		if (subCmd === "view") {
			const caseid = interaction.options.getInteger("id");
			const punishment = client.punishments._content.find(x => x.id === caseid);
			if(!punishment) return interaction.reply({content: "A case with that ID wasn't found!"});
			const cancelledBy = punishment.expired ? client.punishments._content.find(x => x.cancels === punishment.id) : null;
			const cancels = punishment.cancels ? client.punishments._content.find(x => x.id === punishment.cancels) : null;
			const embed = new client.embed()
				.setTitle(`${client.formatPunishmentType(punishment, client, cancels)} | Case #${punishment.id}`)
				.addField(':small_blue_diamond: User', `<@${punishment.member}> \`${punishment.member}\``, true)
				.addField(':small_blue_diamond: Moderator', `<@${punishment.moderator}> \`${punishment.moderator}\``, true)
				.addField('\u200b', '\u200b', true)
				.addField(':small_blue_diamond: Reason', `\`${punishment.reason || 'unspecified'}\``, true)
				.setColor(client.config.embedColor)
				.setTimestamp(punishment.time)
			if (punishment.duration) {
				embed
					.addField(':small_blue_diamond: Duration', client.formatTime(punishment.duration, 100), true)
					.addField('\u200b', '\u200b', true)
			}
			if (punishment.expired) embed.addField(':small_blue_diamond: Expired', `This case has been overwritten by Case #${cancelledBy.id} for reason \`${cancelledBy.reason}\``)
			if (punishment.cancels) embed.addField(':small_blue_diamond: Overwrites', `This case overwrites Case #${cancels.id} \`${cancels.reason}\``)
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		} else {
			// if caseid is a user id, show their punishments, sorted by most recent
			const userId = interaction.options.getUser("user").id;
			const userPunishments = client.punishments._content.filter(x => x.member === userId).sort((a, b) => a.time - b.time).map(punishment => {
				return {
					name: `${client.formatPunishmentType(punishment, client)} | Case #${punishment.id}`,
					value: `Reason: \`${punishment.reason}\`\n${punishment.duration ? `Duration: ${client.formatTime(punishment.duration, 3)}\n` : ''}Moderator: <@${punishment.moderator}>${punishment.expired ? `\nOverwritten by Case #${client.punishments._content.find(x => x.cancels === punishment.id).id}` : ''}${punishment.cancels ? `\nOverwrites Case #${punishment.cancels}` : ''}`
				}
			});

			// if case id is not a punishment or a user, failed
			if (!userPunishments || userPunishments.length === 0) return interaction.reply({content: 'No punishments found with that Case # or user ID', allowedMentions: { repliedUser: false }});

			const pageNumber = interaction.options.getInteger("page") ?? 1;
			const embed = new client.embed()
				.setTitle(`Punishments given to ${userId}`)
				.setDescription(`User: <@${userId}>`)
				.setFooter({text: `${userPunishments.length} total punishments. Viewing page ${pageNumber} out of ${Math.ceil(userPunishments.length / 25)}.`})
				.setColor(client.config.embedColor)
			embed.addFields(userPunishments.slice((pageNumber - 1) * 25, pageNumber * 25));
			return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		}
	},
	data: new SlashCommandBuilder().setName("case").setDescription("Views a member's cases, or a single case ID.").addSubcommand((optt)=>optt.setName("view").setDescription("Views a single case ID").addIntegerOption((opt)=>opt.setName("id").setDescription("The ID of the case.").setRequired(true))).addSubcommand((optt)=>optt.setName("member").setDescription("Views all a members cases").addUserOption((opt)=>opt.setName("user").setDescription("The user whomm's punishments you want to view.").setRequired(true)).addIntegerOption((opt)=>opt.setName("page").setDescription("The page number.").setRequired(false))),
	category: 'Moderation',
	alias: ['cases'],
};