const { SlashCommandBuilder } = require("@discordjs/builders");
function displayCr(channels = [], client) {
	// channels is an array of channel ids
	// returns an embed description
	let description = '';
	if (channels.length > 1) { // if user wants more than 1 channel displayed
		// loop through all channels and map their active restrictions
		channels = channels.map(channelId => [channelId, client.channelRestrictions._content[channelId]]);
		
		channels.forEach(channel => {
			// find identicals
			const identicals = channels.filter(candidateIdentical => {
				return candidateIdentical[1].every(candidateIdenticalRestriction => channel[1].includes(candidateIdenticalRestriction)) && channel[1].every(activeRestriction => candidateIdentical[1].includes(activeRestriction))
			});
			if (identicals.length === 0) return;
			// if there are no identicals, identicals will only contain this 1 channel

			// add channel mentions
			description += identicals.map(x => `<#${x[0]}>`).join(', ');
			// begin restrictions
			description += '\n\`\`\`\n';
			// restrictions
			description += channel[1].map(restriction => `    ❌ ${restriction}`).join('\n')
			// end restrictions
			description += '\n\`\`\`\n';

			// if there are identicals, remove them from the queue
			channels = channels.filter(ch => !identicals.some(x => x[0] === ch[0]));
		})
	} else if (channels.length === 1) {
		// find channel and its restrictions
		const channel = [channels[0], client.channelRestrictions._content[channels[0]]];

		// if channel has no restrictions
		if (!channel[1]) return description;

		// add channel mention
		description += `<#${channel[0]}>`;
		// begin restrictions
		description += '\n\`\`\`\n';
		// restrictions
		description += channel[1].map(restriction => `    ❌ ${restriction}`).join('\n')
		// end restrictions
		description += '\n\`\`\`\n';
	}
	return description;
}
module.exports = {
	run: (client, interaction) => {
		const subCmd = interaction.options.getSubcommand();
		if (subCmd === "category_names") {
				const embed = new client.embed()
					.setTitle('Acceptable command and category names')
					.setDescription(client.categoryNames.join(', '))
					.setFooter({text: 'Or any bot command name.'})
					.setColor(client.config.embedColor)
				return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			} else if (subCmd === "why") {
				const embed = new client.embed()
					.setTitle('Why can I not do bot commands?')
					.addField(':small_blue_diamond: The command you tried to do is restricted in this channel.', 'This is to reduce spam and clutter.')
					.addField(':small_blue_diamond: Try a different channel instead.', '<#902524214718902332> is a channel dedicated to using bot commands.')
					.addField(':small_blue_diamond: This phenomenon is called _channel restrictions._', `<@&${client.config.mainServer.roles.moderator}>s restrict certain categories of commands from being used in different channels. Active restrictions are available for everyone to see with \`/channelrestrictions\`.`)
					.addField(':small_blue_diamond: How come _you_ can use restricted commands?', `Anyone with the <@&${client.config.mainServer.roles.levels.three.id}> role can bypass channel restrictions.`)
					.setColor(client.config.embedColor)
				return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		 	} else if(subCmd === "view") {
				const channelId = interaction.options.getChannel("channel").id;
				const embed = new client.embed()
					.setTitle('Active channel restrictions')
					.setDescription(displayCr([channelId], client))
					.setColor(client.config.embedColor)
				if (embed.description.length === 0) embed.setDescription(`<#${channelId}> has no active channel restrictions.`);
				return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			} else {

				const channelId = interaction.options.getChannel("channel");
				const categoryOrCommandName = interaction.options.getString("category_or_command_name").toLowerCase();
				if (categoryOrCommandName) {
					if (!client.hasModPerms(client, interaction.member)) return interaction.reply(`You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command`);

					let restrictionsForThisChannel = client.channelRestrictions._content[channelId];

					if (client.categoryNames.some(x => categoryOrCommandName === x.toLowerCase())) {
						// toggle categoryname
						if (restrictionsForThisChannel?.some(x => x.toLowerCase() === categoryOrCommandName)) {
							const removed = restrictionsForThisChannel.splice(restrictionsForThisChannel.map(x => x.toLowerCase()).indexOf(categoryOrCommandName), 1)[0];
							if (restrictionsForThisChannel.length === 0) client.channelRestrictions.removeData(channelId);
							client.channelRestrictions.forceSave();
							return interaction.reply({content: `Successfully removed restriction of ${removed} commands in <#${channelId}>`, allowedMentions: { repliedUser: false }});
						} else {
							const added = client.categoryNames.find(x => x.toLowerCase() === categoryOrCommandName);
							if (restrictionsForThisChannel) restrictionsForThisChannel.push(added);
							else client.channelRestrictions._content[channelId] = [added];
							client.channelRestrictions.forceSave();
							return interaction.reply({content: `Successfully added restriction of ${added} commands in <#${channelId}>`, allowedMentions: { repliedUser: false }});
						}
					} else if (client.commands.some(x => x.name === categoryOrCommandName)) {
						// categoryOrCommandName is a command

						const stringOfActiveCommandRestrictionsForThisChannel = restrictionsForThisChannel?.find(x => x.startsWith('commands:'));

						const activeCommandRestrictionsForThisChannel = stringOfActiveCommandRestrictionsForThisChannel?.slice(stringOfActiveCommandRestrictionsForThisChannel.indexOf(':') + 1)?.split(',');

						if (activeCommandRestrictionsForThisChannel?.includes(categoryOrCommandName)) {
							// this command is already restricted
							// unrestrict command
							
							const modifiedCommandRestrictions = activeCommandRestrictionsForThisChannel.filter(commandRestriction => commandRestriction !== categoryOrCommandName);
							
							const commandRestrictionsIndex = restrictionsForThisChannel.indexOf(stringOfActiveCommandRestrictionsForThisChannel);
							if (modifiedCommandRestrictions.length === 0) {
								restrictionsForThisChannel.splice(commandRestrictionsIndex, 1);
								if (restrictionsForThisChannel.length === 0) client.channelRestrictions.removeData(channelId);
							} else {
								restrictionsForThisChannel[commandRestrictionsIndex] = 'commands:' + modifiedCommandRestrictions.join(',');
							}

							client.channelRestrictions.forceSave();
							return interaction.reply({content: `Successfully removed restriction of \`${categoryOrCommandName}\` command in <#${channelId}>`, allowedMentions: { repliedUser: false }});
						} else {
							// restrict command
							if (!restrictionsForThisChannel) {
								// channel has no active restrictions
								// set channel restrictions to empty array, dont save
								client.channelRestrictions._content[channelId] = [];
							}

							const stringOfActiveCommandRestrictionsForThisChannel = restrictionsForThisChannel?.find(x => x.startsWith('commands:'));

							if (!stringOfActiveCommandRestrictionsForThisChannel) {
								// channel has no active command restrictions
								// push 'commands:{command}' to the array
								client.channelRestrictions._content[channelId].push(`commands:${categoryOrCommandName}`);
							} else {
								// channel has active command restrictions
								// find in array a string that starts with 'commands:' and add command to the end after a comma
								const commandRestrictionsIndex = restrictionsForThisChannel.indexOf(stringOfActiveCommandRestrictionsForThisChannel);
								client.channelRestrictions._content[channelId][commandRestrictionsIndex] += `,${categoryOrCommandName}`;
							}
							// save
							client.channelRestrictions.forceSave();
							return interaction.reply({content: `Successfully added restriction of \`${categoryOrCommandName}\` command in <#${channelId}>`, allowedMentions: { repliedUser: false }});
						}
					} else {
						return interaction.reply({content: 'You must enter an acceptable category or command name.', allowedMentions: { repliedUser: false }});
					}
				}
			}
		},
	data: new SlashCommandBuilder().setName("channel_restrictions").setDescription("View, Add, Remove, Or Get An Explanation For Channel Restrictions").addSubcommand((optt)=>optt.setName("view").setDescription("View all channel restrictions").addChannelOption((opt)=>opt.setName("channel").setDescription("The channel to retreive restrictions for.").setRequired(true))).addSubcommand((optt)=>optt.setName("why").setDescription("An explanation why.")).addSubcommand((optt)=>optt.setName("category_names").setDescription("A short category view.")).addSubcommand((optt)=>optt.setName("change").setDescription("Add or remove channel restrictions").addChannelOption((opt)=>opt.setName("channel").setDescription("The channel to change restrictions for.").setRequired(true)).addStringOption((opt)=>opt.setName("category_or_command_name").setDescription("The cateogry ot command name.").setRequired(true))),
	category: 'Moderation',
	cooldown: 6
	};