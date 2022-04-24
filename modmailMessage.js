module.exports = async (message, modmailClient, client) => {
	const { Discord, MessageEmbed, MessageActionRow, MessageButton, Interaction, ButtonInteraction } = require("discord.js");
	if (message.channel.type === "DM") { // user has started new modmail
		if (message.author.bot) return;
		if (client.dmForwardBlacklist._content.includes(message.author.id)) return; // if user is blocked, ignore
		const modmailChannel = modmailClient.channels.cache.get(client.config.mainServer.channels.modmail);
		function summaryTimestamp() { // creates clock syntax for use in modmail summary
			return `<t:${Date.now()/1000 | 0}:t>`;
		}
		if (modmailClient.threads.has(message.author.id)) { // modmail thread is already active
			modmailChannel.send({embeds: [new client.embed().setAuthor({name: `Reply | ${message.author.tag} | Case ${modmailClient.threads.get(message.author.id).caseId}`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setColor(client.config.embedColor)]}) // inform mods of additional info
			modmailChannel.send(`${message.content + '\n' + (message.attachments.first()?.url || '')}`) // inform mods of additional info
			modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} **R**: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // add recipients message to summary
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
						await interaction.message.edit({embeds: [new client.embed().setTitle(':white_check_mark: Modmail received!').setDescription('Wait for a reply. If you\'re reporting a user, send additional messages including the user ID of the user you\'re reporting, screenshots and message links. All messages will be forwarded to staff.').setFooter({text: `Case ${caseId}`}).setColor(7844437)], components: []}); // inform user that bot has received modmail
						modmailClient.threads.set(message.author.id, { messages: [], caseId, startTime: new Date() }); // create thread
						modmailChannel.send({content: `${unimportant ? '' : client.config.mainServer.modmailPing.map(x => '<@&' + client.config.mainServer.roles[x] + '>').join(' ')}`, embeds: [new client.embed().setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setTitle(`New Modmail | Case ${caseId}`).setDescription(`<@${message.author.id}>\nSession opened for ${unimportant ? '20' : '10'} minutes.`).setColor(client.config.embedColor)]}); // inform mods of new modmail, show instructions
						modmailChannel.send(`${message.content + '\n' + (message.attachments.first()?.url || '')}`)
						modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} **R**: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // add recipients message to summary
						let collectorEndTimestamp = Date.now() + 10 * 60 * 200; // modmail will end in 10 minutes
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
								return modReply.react('✅');
							} else if (modReply.content.startsWith('rpl')) {
								const args = modReply.content.split(' ');
								const replyCaseId = args[1];
								if (replyCaseId !== caseId) return; // replied to different convo than this
								const reply = args.slice(2).join(' ');
								if (reply.trim().length === 0) return modReply.reply(`\`Case ID: ${caseId}\` Your reply needs to contain text or an attachment. Reply not forwarded.`);
								modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} **M** (<@${modReply.author.id}>): ${args.slice(2).join(' ') + (modReply.attachments.first()?.url ? '[Attachment]' : '')}`); // R = recipient, M = moderator
								message.channel.send({content: `${modReply.attachments.first()?.url || ' '}`, embeds: [new client.embed().setTitle(':warning: Reply').setDescription(`${reply}`).setFooter({text: `${modReply.member.roles.highest.name} | ${modReply.author.tag}`, iconURL: `${modReply.member.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setColor(client.config.embedColor)]})
								return modReply.react('✅');
							} else if (modReply.content.startsWith('end')) {
								const args = modReply.content.split(' ');
								const replyCaseId = args[1];
								if (replyCaseId !== caseId) return; // replied to different convo than this
								const reason = args.slice(2).join(' ');
								message.channel.send({embeds: [new client.embed().setTitle(':x: Session closed').setDescription(`With${reason ? ` reason: ${reason}` : 'out a reason.'}`).setFooter({text: `${modReply.member.roles.highest.name} | ${modReply.author.tag}`, iconURL: `${modReply.member.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })}`}).setColor(14495300)]});
								await modReply.react('✅');
								modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} **M** (<@${modReply.author.id}>) Ended session. Reason: ${reason}`); // R = recipient, M = moderator
								return modReplyCollector.stop();
							}
						});
		
						const interval = setInterval(() => {
							if (Date.now() > collectorEndTimestamp) {
								modReplyCollector.stop();
							} else if (Date.now() + 60 * 1000 > collectorEndTimestamp && !timeWarning) {
								modmailChannel.send({embeds: [new client.embed().setAuthor({name: `Case ${caseId}`}).setTitle(':warning: Session closing in 1 minute.').setColor(client.config.embedColor)]})
								timeWarning = true;
							}
						}, 5000);
		
						modReplyCollector.on('end', () => {
							clearInterval(interval);
							// send embed in modmail channel compiling everything together
							const embed = new client.embed()
								.setAuthor({name: `Case ${caseId}`})
								.setTitle('ModMail Summary')
								.setDescription(`**R:** Recipient: ${message.author.toString()} (${message.author.tag})\n**M:** Moderator\n**Time Elapsed:** ${client.formatTime(Date.now() - modmailClient.threads.get(message.author.id).startTime, 2)}\n\n${modmailClient.threads.get(message.author.id).messages.join('\n\n')}`)
								.setColor(client.config.embedColor)
							modmailChannel.send({embeds: [embed]});
							// remove from threads collection
							if (!modmailClient.threads.get(message.author.id).messages.some(x => x.includes(' **M** ('))) {
								message.channel.send({embeds: [new client.embed().setTitle(':x: Session closed').setDescription(`The Modmail session ended automatically with no further response from a staff member, Please wait for one to contact you personally.`).setFooter({text: `Time limit reached | Case ${caseId}`}).setColor(14495300)]})
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
			{name: '🔹 What?', value: 'ModMail is a bot that makes it easy to contact a staff.', inline: true},
			{name: '🔹 Why?', value: 'ModMail should be used when you want to report a rule breaker on this Discord server.', inline: true},
			{name: '🔹 How?', value: 'Send me a Direct Message on Discord. Staff members will then get in contact with you.', inline: true},
			{name: '🔹 Don\'ts', value: 'Do not spam ModMail.\nDo not use ModMail unnecessarily.', inline: true},
			{name: '🔹 Small things', value: 'If your concern is not urgent, start your ModMail message with "[Unimportant]". This way the staff members know that they don\'t need to rush.', inline: true})
			.setColor(client.config.embedColor)
		message.channel.send({embeds: [embed]});
	}
};
