module.exports = async (message, modmailClient, client) => {
	const { Discord, MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require("discord.js");
	if (message.channel.type === "DM") { // user has started new modmail
		if (message.author.bot) return;
		if (client.dmForwardBlacklist._content.includes(message.author.id)) return; // if user is blocked, ignore
		const modmailChannel = modmailClient.channels.cache.get(client.config.mainServer.channels.modmail);
		function summaryTimestamp() { // creates clock syntax for use in modmail summary
			return `[${client.format24hClock(Date.now(), true)}]`;
		}
		if (modmailClient.threads.has(message.author.id)) { // modmail thread is already active
			modmailChannel.send(`\`Case ID: ${modmailClient.threads.get(message.author.id).caseId}\` Additional information from ${message.author.toString()} (${message.author.tag}): ${message.content + '\n' + (message.attachments.first()?.url || '')}`); // inform mods of additional info
			modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} R: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // add recipients message to summary
			return;
		}
		// new modmail
		const msg = await message.channel.send({embeds: [new MessageEmbed().setTitle("Are you sure you want to open a Modmail case?").setColor(client.config.embedColor)], components: [new MessageActionRow().addComponents(new MessageButton({label: "Send", style: "SUCCESS", customId: "SEND"}), new MessageButton({label: "Cancel", style: "DANGER", customId: "CANCEL"}))]})
		const filter = i => ["SEND", "CANCEL"].includes(i.customId) && i.message.id === msg.id;
		const collector = await message.channel.createMessageComponentCollector({ max: 1, filter, time: 18_000_000 });
		collector.on("collect", async (interaction) => {
			if (interaction.customId === "SEND") {
						await interaction.message.edit({embeds: [new client.embed().setTitle('Modmail sent').setColor(client.config.embedColor)], components: []});
						const caseId = (Date.now() + '').slice(0, -5); // case id is unix timestamp with accuracy of ~1 minute
						const unimportant = message.content.toLowerCase().startsWith('[unimportant]') || message.content.toLowerCase().startsWith('unimportant'); // bool, is modmail unimportant?
						await interaction.message.edit({embeds: [new client.embed().setTitle('Modmail received! :white_check_mark:').setDescription('Wait for a reply. If you\'re reporting a user, send additional messages including the user ID of the user you\'re reporting, screenshots and message links. All messages will be forwarded to a moderator.').setFooter({text: `Case ID: ${caseId}`}).setColor(7844437)], components: []}); // inform user that bot has received modmail
						modmailClient.threads.set(message.author.id, { messages: [], caseId, startTime: new Date() }); // create thread
						modmailChannel.send({content: `${unimportant ? '' : client.config.mainServer.modmailPing.map(x => '<@&' + client.config.mainServer.roles[x] + '>').join(' ')}`, embeds: [new client.embed().setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setTitle(`New Modmail | Case ${caseId}`).setDescription(`Session opened for ${unimportant ? '20' : '10'} minutes`).setColor(client.config.embedColor)]}); // inform mods of new modmail, show instructions
						modmailChannel.send(`${message.content + '\n' + (message.attachments.first()?.url || '')}`)
						modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} R: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // add recipients message to summary
						let collectorEndTimestamp = Date.now() + 10 * 60 * 1000; // modmail will end in 10 minutes
						if (unimportant) collectorEndTimestamp += 10 * 60 * 1000; // if unimportant, give mods 10 more minutes of time to reply
						let timeWarning = false; // bot has not warned of low time remaining
						const modReplyCollector = modmailChannel.createMessageCollector({}); // create message collector in modmail channel for moderators
		
						modReplyCollector.on('collect', async modReply => {
							if (modReply.content.startsWith('et')) {
								const args = modReply.content.split(' ');
								const replyCaseId = args[1];
								if (replyCaseId !== caseId) return; // replied to different convo than this
								collectorEndTimestamp = Date.now() + 10 * 60 * 1000;
								timeWarning = false;
								return modmailChannel.send('Extra time granted. The communication portal will close in 10 minutes.');
							} else if (modReply.content.startsWith('rpl')) {
								const args = modReply.content.split(' ');
								const replyCaseId = args[1];
								if (replyCaseId !== caseId) return; // replied to different convo than this
								const reply = args.slice(2).join(' ');
								if (reply.trim().length === 0) return modReply.reply(`\`Case ID: ${caseId}\` Your reply needs to contain text or an attachment. Reply not forwarded.`);
								modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} M (${modReply.author.username}): ${args.slice(2).join(' ') + (modReply.attachments.first()?.url ? '[Attachment]' : '')}`); // R = recipient, M = moderator
								message.channel.send({content: `${modReply.attachments.first()?.url || ' '}`, embeds: [new client.embed().setTitle(':warning: Reply').setDescription(`${reply}`).setFooter({text: `${modReply.member.roles.highest.name} ${modReply.author.tag}`, iconURL: `${modReply.member.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setColor(client.config.embedColor)]})
								return modmailChannel.send(`\`Case ID: ${caseId}\` Reply forwarded.`);
							} else if (modReply.content.startsWith('end')) {
								const args = modReply.content.split(' ');
								const replyCaseId = args[1];
								if (replyCaseId !== caseId) return; // replied to different convo than this
								const reason = args.slice(2).join(' ');
								message.channel.send({embeds: [new client.embed().setTitle(':x: Session closed').setDescription(`With${reason ? ` reason: ${reason}` : 'out a reason.'}`).setFooter({text: `${modReply.member.roles.highest.name} | ${modReply.author.tag}`, iconURL: `${modReply.member.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setColor(14495300)]});
								await modmailChannel.send(`\`Case ID: ${caseId}\` ModMail session has been closed${reason ? '' : ' without a reason'}.`);
								modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} M (${modReply.author.username}) Ended session. Reason: ${reason}`); // R = recipient, M = moderator
								return modReplyCollector.stop();
							}
						});
		
						const interval = setInterval(() => {
							if (Date.now() > collectorEndTimestamp) {
								modReplyCollector.stop();
								modmailChannel.send(`\`Case ID: ${caseId}\` ModMail session has closed. Moderator, please contact Recipient personally.`);
							} else if (Date.now() + 60 * 1000 > collectorEndTimestamp && !timeWarning) {
								modmailChannel.send(`\`Case ID: ${caseId}\` Portal closing in 1 minute.`);
								timeWarning = true;
							}
						}, 5000);
		
						modReplyCollector.on('end', () => {
							clearInterval(interval);
							// send embed in modmail channel compiling everything together
							const embed = new client.embed()
								.setTitle('ModMail Summary')
								.setDescription(`\`Case ID: ${caseId}\`\nR: Recipient: ${message.author.toString()} (${message.author.tag}), M: Moderator - Time Elapsed: ${client.formatTime(Date.now() - modmailClient.threads.get(message.author.id).startTime, 2)} - Times are in UTC\n\`\`\`\n${modmailClient.threads.get(message.author.id).messages.join('\n')}\n\`\`\``)
								.setFooter({text: 'Starting Time'})
								.setTimestamp(modmailClient.threads.get(message.author.id).startTime)
								.setColor(client.config.embedColor)
							modmailChannel.send({embeds: [embed]});
							// remove from threads collection
							if (!modmailClient.threads.get(message.author.id).messages.some(x => x.includes('] M ('))) {
								message.channel.send(':x: The ModMail session ended automatically with no response from a moderator. Usually this means that there are no moderators online. Please wait patiently. The moderators will contact you when they come online.');
							}
							modmailClient.threads.delete(message.author.id);
						});
				} else if(interaction.customId === "CANCEL") {
					await interaction.message.edit({embeds: [new client.embed().setTitle('Modmail canceled :x:').setColor(14495300)], components: []});
					return;
				}
		});
		
	} else if (message.mentions.members.has(modmailClient.user.id)) {
		const embed = new client.embed()
			.setTitle('ModMail Instructions')
			.addFields(
			{name: '🔹 What?', value: 'ModMail is a bot that makes it easy to contact a server moderator.', inline: true},
			{name: '🔹 Why?', value: 'ModMail should be used when you want to report a rule breaker on this Discord server.', inline: true},
			{name: '🔹 How?', value: 'Send me a Direct Message on Discord. Moderators will then solve your problem.', inline: true},
			{name: '🔹 Don\'ts', value: 'Do not spam ModMail.\nDo not use ModMail unnecessarily.', inline: true},
			{name: '🔹 Small things', value: 'If your concern is not urgent, start your ModMail message with "[Unimportant]". This way the moderators know that they don\'t need to rush.', inline: true})
			.setColor(client.config.embedColor)
		message.channel.send({embeds: [embed]});
	}
};
