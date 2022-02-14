module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }});
		const caseid = parseInt(args[1]);
		if (!caseid) return message.reply({content: 'Invalid case #.', allowedMentions: { repliedUser: false }});
		const punishment = client.punishments._content.find(x => x.id === caseid);
		if (punishment) {
			// show single case
			const cancelledBy = punishment.expired ? client.punishments._content.find(x => x.cancels === punishment.id) : null;
			const cancels = punishment.cancels ? client.punishments._content.find(x => x.id === punishment.cancels) : null;
			const embed = new client.embed()
				.setTitle(`${client.formatPunishmentType(punishment, client, cancels)} | Case #${punishment.id}`)
				.addField(':small_blue_diamond: User', `<@${punishment.member}> \`${punishment.member}\``, true)
				.addField(':small_blue_diamond: Moderator', `<@${punishment.moderator}> \`${punishment.moderator}\``, true)
				.addField('\u200b', '\u200b', true)
				.addField(':small_blue_diamond: Reason', `\`${punishment.reason || 'unspecified'}\``, true)
				.setColor(client.embedColor)
				.setTimestamp(punishment.time)
			if (punishment.duration) {
				embed
					.addField(':small_blue_diamond: Duration', client.formatTime(punishment.duration, 100), true)
					.addField('\u200b', '\u200b', true)
			}
			if (punishment.expired) embed.addField(':small_blue_diamond: Expired', `This case has been overwritten by Case #${cancelledBy.id} for reason \`${cancelledBy.reason}\``)
			if (punishment.cancels) embed.addField(':small_blue_diamond: Overwrites', `This case overwrites Case #${cancels.id} \`${cancels.reason}\``)
			message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		} else {
			// if caseid is a user id, show their punishments, sorted by most recent
			const userPunishments = client.punishments._content.filter(x => x.member === args[1]).sort((a, b) => a.time - b.time).map(punishment => {
				return {
					name: `${client.formatPunishmentType(punishment, client)} | Case #${punishment.id}`,
					value: `Reason: \`${punishment.reason}\`\n${punishment.duration ? `Duration: ${client.formatTime(punishment.duration, 3)}\n` : ''}Moderator: <@${punishment.moderator}>${punishment.expired ? `\nOverwritten by Case #${client.punishments._content.find(x => x.cancels === punishment.id).id}` : ''}${punishment.cancels ? `\nOverwrites Case #${punishment.cancels}` : ''}`
				}
			});

			// if case id is not a punishment or a user, failed
			if (!userPunishments || userPunishments.length === 0) return message.reply({content: 'No punishments found with that Case # or user ID', allowedMentions: { repliedUser: false }});

			const pageNumber = parseInt(args[2]) || 1;
			const embed = new client.embed()
				.setTitle('Punishments given to ' + args[1])
				.setDescription(`User: <@${args[1]}>`)
				.setFooter({text: `${userPunishments.length} total punishments. Viewing page ${pageNumber} out of ${Math.ceil(userPunishments.length / 25)}.`})
				.setColor(client.embedColor)
			embed.addFields(userPunishments.slice((pageNumber - 1) * 25, pageNumber * 25));
			return message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		}
	},
	name: 'case',
	description: 'Get information about a specific punishment case or all the punishments of a user.',
	usage: ['case # / user id', '?page'],
	category: 'Moderation',
	alias: ['cases'],
};