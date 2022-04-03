module.exports = {
    name: "messageCreate",
    tracker: false,
    giveaway: false,
	frs: false,
    execute: async (client, message) => {
    if (!client.config.botSwitches.commands && (!client.config.eval.whitelist.includes(message.author.id) || !message.member.roles.cache.has(client.config.mainServer.roles.botdeveloper))) return; // bot is being run in dev mode and a non eval whitelisted or non bot dev user sent a interaction. ignore the interaction.
	if (message.partial) return;
	if (message.author.bot) return;
	if (message.channel.type === "DM") {
        if (client.dmForwardBlacklist._content.includes(message.author.id) || message.author.bot) return;
        if (client.games.some(x => x === message.author.tag)) return;
        const channel = client.channels.cache.get(client.config.mainServer.channels.modlogs);
        const fpb = client.guilds.cache.get(client.config.mainServer.id);
        const guildMemberObject = await fpb?.members.cache.get(message.author.id);
        if(guildMemberObject) {
        const embed = new client.embed()
            .setTitle('Forwarded DM Message')
            .setDescription(`<@${message.author.id}>`)
            .setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
            .setColor(client.config.embedColor)
            .addFields({name: 'Message Content', value: message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content + '\u200b'})
            .setTimestamp(Date.now());
        let messageAttachmentsText = '';
        message.attachments.forEach(attachment => {
            if (!embed.image && ['png', 'jpg', 'webp', 'gif', 'jpeg'].some(x => attachment.name.endsWith(x))) embed.setImage(attachment.url);
            else messageAttachmentsText += `[${attachment.name}](${attachment.url})\n`;
        });
        if (messageAttachmentsText.length > 0) embed.addFields({name: 'Message Attachments', value: messageAttachmentsText.trim()});
        embed
            .addFields({name: 'Roles:', value: guildMemberObject.roles.cache.size > 1 ? guildMemberObject.roles.cache.filter(x => x.id !== client.config.mainServer.id).sort((a, b) => b.position - a.position).map(x => x).join(guildMemberObject.roles.cache.size > 4 ? ' ' : '\n').slice(0, 1024) : 'None'})
        channel.send({content: client.config.eval.whitelist.map(x => `<@${x}>`).join(', '), embeds: [embed]});
    } else {
    const embed = new client.embed()
            .setTitle('Forwarded DM Message')
            .setDescription(`<@${message.author.id}>`)
            .setAuthor({name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true})})
            .setColor(client.config.embedColor)
            .addFields({name: 'Message Content', value: message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content + '\u200b'})
            .setTimestamp(Date.now());
        let messageAttachmentsText = '';
        message.attachments.forEach(attachment => {
            if (!embed.image && ['png', 'jpg', 'webp', 'gif', 'jpeg'].some(x => attachment.name.endsWith(x))) embed.setImage(attachment.url);
            else messageAttachmentsText += `[${attachment.name}](${attachment.url})\n`;
        });
        if (messageAttachmentsText.length > 0) embed.addFields({name: 'message Attachments', value: messageAttachmentsText.trim()});
        channel.send({content: client.config.eval.whitelist.map(x => `<@${x}>`).join(', '), embeds: [embed]});
    }
    }
	if (!message.guild) return;
	
	// judge-your-build-event message filter; only allow messages that contain an image
	// if (message.channel.id === '925500847390097461' && message.attachments.size<1 && !message.author.bot) {
	//  	message.delete();
	// }

	// handle banned words
	if (client.config.botSwitches.automod && client.bannedWords._content.some(word => message.content.toLowerCase().includes(word)) && !client.hasModPerms(client, message.member) && message.guild.id === client.config.mainServer.id)
		return message.delete() && message.channel.send("That word is banned here.").then(x => setTimeout(() => x.delete(), 5000));


	// useless staff ping mute
	const punishableRoleMentions = [
		client.config.mainServer.roles.trialmoderator,
		client.config.mainServer.roles.moderator
	];
	if (message.mentions.roles.some(mentionedRole => punishableRoleMentions.includes(mentionedRole.id))) {
		console.log("user mentioned staff role");
		const filter = x => client.hasModPerms(client, x.member) && x.content === "y";
		message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"]}).then(async collected => {
			console.log("received \"y\" from staff member, indicating to mute someone");
			try {
				const muteResult = await client.punishments.addPunishment("mute", message.member, { time: "5m", reason: "Useless staff ping", message: message}, collected.first().author.id);
			} catch (error) {
				console.log("muting failed cuz", error);
			}
		}).catch(() => console.log("failed to collect \"y\" from staff"));
	}

		function onTimeout() {
			if (client.repeatedMessages[message.author.id]?.nicknameChanged) message.member.setNickname(null, "repeated messages; false alarm");
			delete client.repeatedMessages[message.author.id];
		}

		// repeated messages
		if (message.content.length > 10 && ["https://", "http://", "@everyone", "@here", ".com", ".ru", ".org", ".net", ".xyz"].some(x => message.content.toLowerCase().includes(x)) && message.guild.id === client.config.mainServer.id && !client.hasModPerms(client, message.member)) {
			const thisContent = message.content.slice(0, 32);
			if (client.repeatedMessages[message.author.id]) {
				if (thisContent.includes('tenor')) {
					return;
				}   else {
				// add this message to the list
				client.repeatedMessages[message.author.id].set(message.createdTimestamp, { cont: thisContent, ch: message.channel.id });

				// reset timeout
				clearTimeout(client.repeatedMessages[message.author.id].to);
				client.repeatedMessages[message.author.id].to = setTimeout(onTimeout, 60000);

				// this is the time in which 3 messages have to be sent, in milliseconds
				const threshold = 60000;

				// message mustve been sent after (now - threshold), so purge those that were sent earlier
				client.repeatedMessages[message.author.id] = client.repeatedMessages[message.author.id].filter((x, i) => i >= Date.now() - threshold)

				// if user has sent the same message 2 times in the last threshold milliseconds, change their nickname
				if (client.repeatedMessages[message.author.id]?.find(x => {
					return client.repeatedMessages[message.author.id].filter(y => y.cont === x.cont).size === 2;
				})) {
					client.repeatedMessages[message.author.id].nicknameChanged = true;
					message.member.setNickname("⚠ Possible Scammer ⚠", "repeated messages");
				}

				/* if user has sent the same message 3 times in the last threshold milliseconds, notify them
				if (client.repeatedMessages[message.author.id]?.find(x => {
					return client.repeatedMessages[message.author.id].filter(y => y.cont === x.cont).size === 3;
				})) {
					client.repeatedMessages[message.author.id].warnMsg = await message.reply("Stop spamming that message!");
				}*/

				// a spammed message is one that has been sent at least 3 times in the last threshold milliseconds
				const spammedMessage = client.repeatedMessages[message.author.id]?.find(x => {
					return client.repeatedMessages[message.author.id].filter(y => y.cont === x.cont).size >= 3;
				});

				// if a spammed message exists;
				if (spammedMessage) {
					// softban
					const softbanResult = await client.punishments.addPunishment("softban", message.member, { reason: "repeated messages" }, client.user.id);

					// timestamp of first spammed message
					const spamOriginTimestamp = client.repeatedMessages[message.author.id].firstKey();

					client.repeatedMessagesContent.addData(message.content.split(' ')).forceSave();
					const index = client.repeatedMessagesContent._content.length - 1;

					// send info about this user and their spamming
					client.channels.cache.get(client.config.mainServer.channels.caselogs).send({content: `Anti-spam triggered, here's the details:\n\`https://\` ${message.content.toLowerCase().includes("https://") ? ":white_check_mark:" : ":x:"}\n\`http://\` ${message.content.toLowerCase().includes("http://") ? ":white_check_mark:" : ":x:"}\n\`@everyone/@here\` ${(message.content.toLowerCase().includes("@everyone") || message.content.toLowerCase().includes("@here")) ? ":white_check_mark:" : ":x:"}\n\`top-level domain\` ${[".com", ".ru", ".org", ".net"].some(x => message.content.toLowerCase().includes(x))}\nMessage Information:\n${client.repeatedMessages[message.author.id].map((x, i) => `: ${i - spamOriginTimestamp}ms, <#${x.ch}>`).map((x, i) => `\`${i + 1}\`` + x).join("\n")}\nThreshold: ${threshold}ms\nLRS message Count: ${client.userLevels.getUser(message.author.id)}`});

					// and clear their list of long messages
					delete client.repeatedMessages[message.author.id];
				}
			}} else {
				client.repeatedMessages[message.author.id] = new client.collection();
				client.repeatedMessages[message.author.id].set(message.createdTimestamp, { cont: message.content.slice(0, 32), ch: message.channel.id });

				// auto delete after 1 minute
				client.repeatedMessages[message.author.id].to = setTimeout(onTimeout, 60000);
			}
		}

		const BLACKLISTED_CHANNELS = [
			"902524214718902332", /* bot-commands */
			"915420466238349322", /* mod-commands */
			"879581805529948180", /* mod-logs */
			"940726714915495946" /* fpb-testing */
		];
		// if message was not sent in a blacklisted channel and this is the right server, count towards user level
		if (!BLACKLISTED_CHANNELS.includes(message.channel.id) && message.guild.id === client.config.mainServer.id){ 
			client.userLevels.incrementUser(message.author.id);
			const eligiblity = await client.userLevels.getEligible(message.member);			
			let nextRoleKey;
			//const roleArray = [];
			//client.config.mainServer.roles.levels.forEach((e)=>{roleArray.push(e.id)});
			Object.values(client.config.mainServer.roles.levels).map(x=>x.id).forEach(async (role)=>{
				if(message.member.roles.cache.has(role)){
					nextRoleKey = parseInt(`${message.guild.roles.cache.get(role).name}`.toLowerCase().replace("level ", ""));
				}
			});
			if(nextRoleKey){
			// eligibility information about the next level role
			const nextRoleReq = eligiblity.roles[nextRoleKey ? nextRoleKey : 0];
			const lastRoleReq = nextRoleKey ? eligiblity.roles[nextRoleKey - 1] : null;
	
			// next <Role> in level roles that user is going to get 
			const nextRole = nextRoleReq ? nextRoleReq.role.id : undefined;
			const lastRole = lastRoleReq ? lastRoleReq.role.id : undefined;
			if(nextRoleReq.eligible){
			message.member.roles.add(nextRole);
			message.member.roles.remove(lastRole);
			client.channels.cache.get(client.config.mainServer.channels.bot_commands).send({content: `<@${message.author.id}> has received the <@&${nextRole}> role.`, allowedMentions: {roles: false}});
			}
			}
		}
	// handle discord invite links
	if (!client.config.botSwitches.automod) return;
	if (message.content.includes("discord.gg/") && !message.member.roles.cache.has(client.config.mainServer.roles.moderator) && !message.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)&& message.guild.id === client.config.mainServer.id) {
		message.delete()
		client.punishments.addPunishment("warn", message.member, { reason: "Discord advertisement" }, client.user.id)
		message.channel.send("No advertising other Discord servers.").then(x => setTimeout(() => x.delete(), 10000))
	}
	// auto responses
	if(message.content.startsWith(",")){
		return message.reply({content: "Regular commands are deprecated, the bot uses slash commands now", allowedMentions: {repliedUser: false}});
	}
	if (message.content.toLowerCase().includes("forgor")) {
		message.react("💀")
	}
	if (message.content.toLowerCase().includes("mryeester")) {
		message.react(":yeester:947946389210529832")
	}
	if (message.content.toLowerCase().includes("deez nuts")) {
		message.react(":obamatroll:911214574815023154")
	}
	if (message.content.toLowerCase().includes('warn')) {
		// 20% chance it will respond with an image
		if (Math.random() < 0.2) message.reply({content: 'https://media.discordapp.net/attachments/858068843570003998/935651851494363136/c472i6ozwl561_remastered.jpg', allowedMentions: { repliedUser: false }}).then(x => setTimeout(() => x.delete(), 7000))
	}
	if (message.content.toLowerCase().includes("userbenchmark.com")) {
		message.reply(":b:ingus y u use userbenchmark");
	}
}
}