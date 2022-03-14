const intents = ["GUILDS", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", "GUILD_BANS", "DIRECT_MESSAGES", "GUILD_VOICE_STATES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"]
const Discord = require("discord.js");
const client = new Discord.Client({ intents: intents, disableEveryone: true, partials: ["MESSAGE", "REACTION", "CHANNEL"] });
const modmailClient = new Discord.Client({ disableEveryone: true, intents: intents, partials: ["MESSAGE", "REACTION", "CHANNEL"]});
const fs = require("fs");
const path = require("path");
const database = require("./database.js");
const InvitesTracker = require('@androz2091/discord-invites-tracker');
client.tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});
client.config = require("./config.json");
console.log("Using ./config.json");

console.log(`Bot switches\nFramepaste: ${client.config.botSwitches.fpb}\nModmail: ${client.config.botSwitches.modmail}\nCommands: ${client.config.botSwitches.commands}\nAutomod: ${client.config.botSwitches.automod}\nReaction Roles: ${client.config.botSwitches.reactionRoles}\nFree Games: ${client.config.botSwitches.freeGames}`);

Object.assign(client.config, require("./tokens.json"));
client.prefix = client.config.prefix;
client.setMaxListeners(100)
// global properties
Object.assign(client, {
	embed: Discord.MessageEmbed,
	messageCollector: Discord.MessageCollector,
	collection: Discord.Collection,
	messageattachment: Discord.MessageAttachment,
	cpulist: {
		INTEL: JSON.parse(fs.readFileSync(__dirname + "/databases/cpulist-INTEL.json")),
		AMD: JSON.parse(fs.readFileSync(__dirname + "/databases/cpulist-AMD.json")),
	},
	memberCount_LastGuildFetchTimestamp: 0,
	helpDefaultOptions: {
		parts: ["name", "usage", "shortDescription", "alias"],
		titles: ["alias"]
	},
	embedColor: 14014681,
	starLimit: 3,
	selfStarAllowed: false
});
const {FreeStuffApi} = require("freestuff");
const frs = new FreeStuffApi({
	key: client.config.fsApiKey
  });
client.frs = frs;
// main bot login
client.on("ready", async () => {
	client.guilds.cache.forEach(async (e)=>{await e.members.fetch();});
	await client.channels.fetch(require("./config.json").mainServer.channels.modlogs).then((channel)=>{channel.send(`:warning: Bot restarted :warning:\n${client.config.eval.whitelist.map(x => `<@${x}>`).join(' ')}`)});
	process.on("unhandledRejection", async (error)=>{
		console.log(error)
		await client.channels.fetch(require("./config.json").mainServer.channels.modlogs).then((channel)=>{
        channel.send({content: `${client.config.eval.whitelist.map(x=>`<@${x}>`).join(", ")}`, embeds: [new Discord.MessageEmbed().setTitle("Error Caught!").setColor("#420420").setDescription(`**Error:** \`${error.message}\`\n\n**Stack:** \`${`${error.stack}`.slice(0, 2500)}\``)]})
		})
	});
	setInterval(async () => {
		await client.user.setActivity(`${client.prefix}help`, {
			type: "LISTENING",
		})
	}, 60000);
	console.log(`Bot active as ${client.user.tag} with prefix ${client.prefix}`);

	// giveaways
	const { GiveawaysManager } = require('discord-giveaways');
	client.giveawaysManager = new GiveawaysManager(client, {
		storage: "./databases/giveaways.json",
		updateCountdownEvery: 5000,
		default: {
			botsCanWin: false,
			embedColor: client.config.embedColor,
			embedColorEnd: 14495300,
			
			reaction: "🎉"
		}
	});

	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    eventFiles.forEach((file)=>{
    const event = require(`./events/${file}`);
    if(event.giveaway){
	client.giveawaysManager.on(event.name, async (...args) => event.execute(...args));
    } else if(event.tracker){
	client.tracker.on(event.name, async (...args) => event.execute(client, ...args));
    } else if(event.frs){
		frs.on(event.name, async (...args) => event.execute(client, frs, ...args));
	} else {
	client.on(event.name, async (...args) => event.execute(client, ...args));
    };
  }); 
});

// modmail bot login
modmailClient.on("ready", async () => {
	setInterval(async () => {
		await modmailClient.user.setActivity("DMs", {
			type: "LISTENING",
		});
	}, 60000);
	console.log(`Modmail Bot active as ${modmailClient.user.tag}`);
});

// meme approval queue
client.memeQueue = new client.collection();

// cooldowns
client.cooldowns = new client.collection();

// databases
client.bannedWords = new database("./databases/bannedWords.json", "array");
client.bannedWords.initLoad();

client.tictactoeDb = new database("./databases/ttt.json", "array"); /* players, winner, draw, startTime, endTime */
client.tictactoeDb.initLoad().intervalSave();

client.userLevels = new database("./databases/userLevels.json", "object");
client.userLevels.initLoad().intervalSave(15000).disableSaveNotifs();

client.dmForwardBlacklist = new database("./databases/dmforwardblacklist.json", "array");
client.dmForwardBlacklist.initLoad();

client.punishments = new database("./databases/punishments.json", "array");
client.punishments.initLoad();

client.specsDb = new database("./databases/specs.json", "object");
client.specsDb.initLoad().intervalSave(120000);

client.votes = new database("./databases/suggestvotes.json", "array")
client.votes.initLoad();

client.channelRestrictions = new database("./databases/channelRestrictions.json", "object");
client.channelRestrictions.initLoad();

client.starboard = new database("./databases/starboard.json", "object");
client.starboard.initLoad().intervalSave(60000);

client.repeatedMessages = {};
client.repeatedMessagesContent = new database("./databases/repeatedMessagesContent.json", "array");
client.repeatedMessagesContent.initLoad();

// tic tac toe statistics database
Object.assign(client.tictactoeDb, {
	// global stats
	getTotalGames() {
		const amount = this._content.length;
		return amount;
	},
	getRecentGames(amount) {
		const games = this._content.sort((a, b) => b.startTime - a.startTime).slice(0, amount - 1);
		return games;
	},
	getAllPlayers() {
		const players = {};
		this._content.forEach(game => {
			game.players.forEach(player => {
				if (!players[player]) players[player] = { wins: 0, losses: 0, draws: 0, total: 0 };
				players[player].total++;
				if (game.draw) return players[player].draws++;
				if (player === game.winner) {
					return players[player].wins++;
				} else {
					return players[player].losses++;
				}
			});
		});
		return players;
	},
	getBestPlayers(amount) {
		const players = Object.entries(this.getAllPlayers()).filter(x => x[1].total >= 10).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total).slice(0, amount - 1)
		return players;
	},
	getMostActivePlayers(amount) {
		const players = Object.entries(this.getAllPlayers()).sort((a, b) => b[1].total - a[1].total).slice(0, amount - 1)
		return players;
	},
	// player stats
	getPlayerGames(player) {
		const games = this._content.filter(x => x.players.includes(player));
		return games;
	},
	getPlayerRecentGames(player, amount) {
		const games = this._content.filter(x => x.players.includes(player)).sort((a, b) => b.startTime - a.startTime).slice(0, amount - 1);
		return games;
	},
	calcWinPercentage(player) {
		return ((player.wins / player.total) * 100).toFixed(2) + "%";
	}
});

// 1 game per channel
client.games = new Discord.Collection();

// userLevels
Object.assign(client.userLevels, {
	_requirements: client.config.mainServer.roles.levels,
	_milestone() {
		const milestones = [10, 100, 1000, 50000, 69696, 100000, 200000, 300000, 400000, 420000, 500000]; // always keep the previously achived milestone in the array so the progress is correct. here you can stack as many future milestones as youd like
		const total = Object.values(this._content || {}).reduce((a, b) => a + b, 0);
		const next = milestones.find(x => x >= total) || undefined;
		const previous = milestones[milestones.indexOf(next) - 1] || 0;
		return {
			total,
			next,
			previous,
			progress: (total - previous) / (next - previous)
		}
	},
	incrementUser(userid) {
		const amount = this._content[userid];
		if (amount) this._content[userid]++;
		else this._content[userid] = 1;
		// milestone
		const milestone = this._milestone();
		if (milestone && milestone.total === this._milestone().next) {
			const channel = client.channels.resolve("858073309920755773"); // #announcements
			if (!channel) return console.log("tried to send milestone announcement but channel wasnt found");
			channel.send(`:tada: Milestone reached! **${milestone.next.toLocaleString("en-US")}** messages have been sent in this server and recorded by Level Roles. :tada:`);
		}
		return this;
	},
	getUser(userid) {
		return this._content[userid] || 0;
	},
	hasUser(userid) {
		return !!this._content[userid];
	},
	getEligible(guildMember) {
		const age = (Date.now() - guildMember.joinedTimestamp) / 1000 / 60 / 60 / 24;
		const messages = this.getUser(guildMember.user.id);
		const roles = Object.entries(this._requirements).map((x, key) => {
			return {
				role: {
					level: key,
					id: x[1].id,
					has: guildMember.roles.cache.has(x[1].id)
				},
				requirements: {
					age: x[1].age,
					messages: x[1].messages
				},
				eligible: (age >= x[1].age) && (messages >= x[1].messages),
			}
		});
		return { age, messages, roles };
	},
});

// specs
Object.assign(client.specsDb, {
	editSpecs(id, component, newValue) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, "-")).indexOf(component.toLowerCase().replace(/ /g, "-"));
		this._content[id][allComponents[index]] = newValue;
		return this;
	},
	addSpec(id, component, value) {
		this._content[id][component] = value;
		return this;
	},
	deleteSpec(id, component) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, "-")).indexOf(component.toLowerCase().replace(/ /g, "-"));
		delete this._content[id][allComponents[index]];
		if (Object.keys(this._content[id]).length === 0) this.deleteData(id);
		return this;
	},
	deleteData(id) {
		delete this._content[id];
		return this;
	},
	getUser(id) {
		const user = this._content[id];
		return user;
	},
	hasUser(id) {
		const user = this._content[id];
		return !!user;
	},
	hasSpec(id, component) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, "-")).indexOf(component.toLowerCase().replace(/ /g, "-"));
		return index >= 0;
	}

});

Object.assign(client.punishments, {
	createId() {
		return Math.max(...client.punishments._content.map(x => x.id), 0) + 1;
	},
	async addPunishment(type = "", member, options = {}, moderator) {
		const now = Date.now();
		const { time, reason, message } = options;
		const ms = require("ms");
		let timeInMillis;
		if(type != "mute"){
			timeInMillis = time ? ms(time) : null;
		} else {
			timeInMillis = time ? ms(time) : 2419200000;
		}
		switch (type) {
			case "ban":
				const banData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const dm1 = await member.send(`You've been banned from ${member.guild.name} ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : "forever"} for reason \`${reason || "unspecified"}\` (Case #${banData.id})`).catch(err => setTimeout(() => message.channel.send('Failed to DM user.'), 500));
				const banResult = await member.ban({ reason: `${reason || "unspecified"} | Case #${banData.id}` }).catch(err => err.message);
				if (typeof banResult === "string") {
					dm1.delete();
					return message.channel.send(`Ban was unsuccessful: ${banResult}`);
				} else {
					if (timeInMillis) {
						banData.endTime = now + timeInMillis;
						banData.duration = timeInMillis;
					}
					if (reason) banData.reason = reason;
					client.makeModlogEntry(banData, client);
					this.addData(banData);
					this.forceSave();
					const embedm = new client.embed()
					    .setTitle(`Case #${banData.id}: Ban`)
					    .setDescription(`${member.user.tag}\n<@${member.user.id}>\n(\`${member.user.id}\`)`)
					    .addField('Reason', `\`${reason || "unspecified"}\``)
					    .addField('Duration', `${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : "forever"}`)
					    .setColor(client.config.embedColor)
			    	return message.channel.send({embeds: [embedm]});
				}
			case "softban":
				const guild = member.guild;
				const softbanData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const dm2 = await member.send(`You've been softbanned from ${member.guild.name} for reason \`${reason || "unspecified"}\` (Case #${softbanData.id})`).catch(err => setTimeout(() => message.channel.send(`Failed to DM <@${member.user.id}>.`), 500));
				const softbanResult = await member.ban({ days: 7, reason: `${reason || "unspecified"} | Case #${softbanData.id}` }).catch(err => err.message);
				if (typeof softbanResult === "string") {
					dm2.delete();
					return message.channel.send(`Softan was unsuccessful: ${softbanResult}`);
				} else {
					const unbanResult = guild.members.unban(softbanData.member, `${reason || "unspecified"} | Case #${softbanData.id}`).catch(err => err.message);
					if (typeof unbanResult === "string") {
						return message.channel.send(`Softbanan (unban) was unsuccessful: ${softbanResult}`);
					} else {
						if (reason) softbanData.reason = reason;
						client.makeModlogEntry(softbanData, client);
						this.addData(softbanData);
						this.forceSave();
						const embeds = new client.embed()
					    	.setTitle(`Case #${softbanData.id}: Softban`)
					    	.setDescription(`${member.user.tag}\n<@${member.user.id}>\n(\`${member.user.id}\`)`)
					    	.addField('Reason', `\`${reason || "unspecified"}\``)
					    	.setColor(client.config.embedColor)
						return message.channel.send({embeds: [embeds]});
					}
				}
			case "kick":
				const kickData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const dm3 = await member.send(`You've been kicked from ${member.guild.name} for reason \`${reason || "unspecified"}\` (Case #${kickData.id})`).catch(err => setTimeout(() => message.channel.send(`Failed to DM <@${member.user.id}>.`), 500));
				const kickResult = await member.kick(`${reason || "unspecified"} | Case #${kickData.id}`).catch(err => err.message);
				if (typeof kickResult === "string") {
					dm3.delete();
					return message.channel.send(`Kick was unsuccessful: ${kickResult}`);
				} else {
					if (reason) kickData.reason = reason;
					client.makeModlogEntry(kickData, client);
					this.addData(kickData);
					this.forceSave();
					const embedk = new client.embed()
					    .setTitle(`Case #${kickData.id}: Kick`)
					    .setDescription(`${member.user.tag}\n<@${member.user.id}>\n(\`${member.user.id}\`)`)
					    .addField('Reason', `\`${reason || "unspecified"}\``)
					    .setColor(client.config.embedColor)
					return message.channel.send({embeds: [embedk]});
				}
			case "mute":
				const muteData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				let muteResult;
				if(client.hasModPerms(client, member)) return "Staff members cannot be muted."
				const dm4 = await member.send(`You've been muted in ${member.guild.name} ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : "forever"} for reason \`${reason || "unspecified"}\` (Case #${muteData.id})`).catch(err => setTimeout(() => message.channel.send('Failed to DM user.'), 500));
				if(timeInMillis){
				muteResult = await member.timeout(timeInMillis, `${reason || "unspecified"} | Case #${muteData.id}`).catch(err => err.message);
				} else {
				muteResult = await member.timeout(2419200000, `${reason || "unspecified"} | Case #${muteData.id}`).catch(err => err.message);
				}
				if (typeof muteResult === "string") {
					dm4.delete();
					return message.channel.send(`Mute was unsuccessful: ${muteResult}`);
				} else {
					if (timeInMillis) {
						muteData.endTime = now + timeInMillis;
						muteData.duration = timeInMillis;
					}
					if (reason) muteData.reason = reason;
					client.makeModlogEntry(muteData, client);
					this.addData(muteData);
					this.forceSave();
					const embedm = new client.embed()
					    .setTitle(`Case #${muteData.id}: Mute`)
						.setDescription(`${member.user.tag}\n<@${member.user.id}>\n(\`${member.user.id}\`)`)
						.addField('Reason', `\`${reason || "unspecified"}\``)
						.addField('Duration', `${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)`)
						.setColor(client.config.embedColor)
						.setThumbnail('https://cdn.discordapp.com/attachments/858068843570003998/942295666137370715/muted.png')
					return message.channel.send({embeds: [embedm]});
				}
			case "warn":
				const warnData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const warnResult = await member.send(`You've been warned in ${member.guild.name} for reason \`${reason || "unspecified"}\` (Case #${warnData.id})`).catch(err => setTimeout(() => message.channel.send(`Failed to DM <@${member.user.id}>.`), 500));
				if (typeof warnResult === "string") {
					return message.channel.send(`Warn was unsuccessful: ${warnResult}`);
				} else {
					if (reason) warnData.reason = reason;
					client.makeModlogEntry(warnData, client);
					this.addData(warnData);
					this.forceSave();
					const embedw = new client.embed()
					.setTitle(`Case #${warnData.id}: Warn`)
					.setDescription(`${member.user.tag}\n<@${member.user.id}>\n(\`${member.user.id}\`)`)
					.addField('Reason', `\`${reason || "unspecified"}\``)
					.setColor(client.config.embedColor)
					.setThumbnail('https://media.discordapp.net/attachments/858068843570003998/935651851494363136/c472i6ozwl561_remastered.jpg')
					if (moderator !== '795443537356521502') {message.channel.send({embeds: [embedw]})};
				}
		}
	},
	async removePunishment(caseId, moderator, reason) {
		const now = Date.now();
		const punishment = this._content.find(x => x.id === caseId);
		const id = this.createId();
		if (!punishment) return "Punishment not found.";
		if (["ban", "mute"].includes(punishment.type)) {
			const guild = client.guilds.cache.get(client.config.mainServer.id);
			let removePunishmentResult;
			if (punishment.type === "ban") {
				// unban
				removePunishmentResult = await guild.members.unban(punishment.member, `${reason || "unspecified"} | Case #${id}`).catch(err => err.message); // unbanning returns a user
			} else if (punishment.type === "mute") {
				// remove role
				const member = await guild.members.fetch(punishment.member).catch(err => false);
				if (member) {
					removePunishmentResult = await member
					
					if (typeof removePunishmentResult !== "string") {
						member.timeout(null, `${reason || "unspecified"} | Case #${id}`)
						removePunishmentResult.send(`You've been unmuted in ${removePunishmentResult.guild.name}.`);
						removePunishmentResult = removePunishmentResult.user; // removing a role returns a guildmember
					}
				} else {
					// user has probably left. quietly remove punishment from json
					const removePunishmentData = { type: `un${punishment.type}`, id, cancels: punishment.id, member: punishment.member, reason, moderator, time: now };
					this._content[this._content.findIndex(x => x.id === punishment.id)].expired = true;
					this.addData(removePunishmentData).forceSave();
				}
			}
			if (typeof removePunishmentResult === "string") return `Un${punishment.type} was unsuccessful: ${removePunishmentResult}`;
			else {
				const removePunishmentData = { type: `un${punishment.type}`, id, cancels: punishment.id, member: punishment.member, reason, moderator, time: now };
				client.makeModlogEntry(removePunishmentData, client);
				this._content[this._content.findIndex(x => x.id === punishment.id)].expired = true;
				this.addData(removePunishmentData).forceSave();
				return `Successfully ${punishment.type === "ban" ? "unbanned" : "unmuted"} ${removePunishmentResult?.tag} (${removePunishmentResult?.id}) for reason \`${reason || "unspecified"}\``;
			}
		} else {
			try {
				const removePunishmentData = { type: "removeOtherPunishment", id, cancels: punishment.id, member: punishment.member, reason, moderator, time: now };
				client.makeModlogEntry(removePunishmentData, client);
				this._content[this._content.findIndex(x => x.id === punishment.id)].expired = true;
				this.addData(removePunishmentData).forceSave();
				return `Successfully removed Case #${punishment.id} (type: ${punishment.type}, user: ${punishment.member}).`;
			} catch (error) {
				return `${punishment.type[0].toUpperCase() + punishment.type.slice(1)} removal was unsuccessful: ${error.message}`;
			}
		}
	}
});

// command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.commands.get("ping").spammers = new client.collection();

// load functions
const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client[file.slice(0, -3)] = func;
}

// assign page number to commands
let categories = {};
while (client.commands.some(command => !command.hidden && !command.page)) {
	const command = client.commands.find(command => !command.hidden && !command.page);
	if (!command.category) command.category = "Misc";
	if (!categories[command.category]) categories[command.category] = { text: "", currentPage: 1}
	const commandInfo = client.commandInfo(client, command, client.helpDefaultOptions);
	if (categories[command.category].text.length + commandInfo.length > 1024) {
		categories[command.category].text = commandInfo;
		categories[command.category].currentPage++;
	} else {
		categories[command.category].text += commandInfo;
	}
	command.page = categories[command.category].currentPage;
}
client.categoryNames = Object.keys(categories);
delete categories;


client.commands.pages = [];
client.commands.filter(command => !command.hidden).forEach(command => {
	if (!client.commands.pages.some(x => x.category === command.category && x.page === command.page)) {
		client.commands.pages.push({
			name: `${command.category} - Page ${command.page}/${Math.max(...client.commands.filter(x => x.category === command.category).map(x => x.page))}`,
			category: command.category,
			page: command.page
		});
	}
});
client.commands.pages.sort((a, b) => {
	if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	} else {
		return 0;
	}
}).sort((a, b) => {
	if (a.category.toLowerCase() === "pc creator" && b.category.toLowerCase() !== "pc creator") {
		return -1;
	} else {
		return 1;
	}
});

// starboard functionality
Object.assign(client.starboard, {
	async increment(reaction) {
		let dbEntry = this._content[reaction?.message?.id];
		if (dbEntry) dbEntry.c++;
		else {
			if (!reaction?.message?.author?.id) return;
			this.addData(reaction.message.id, { c: 1, a: reaction.message.author.id });
			dbEntry = this._content[reaction.message.id];
		}
		if (dbEntry?.c >= client.starLimit) {
			if (dbEntry.e) {
				const embedMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e);
				if (!embedMessage) {
					delete this._content[reaction.message.id];
				}
				embedMessage.edit({
					content: `**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf("|"))}`,
					embed: [embedMessage.embeds[0]]
				});
			} else {
				const starredMessage = reaction?.message.author ? reaction.message : await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(reaction.message.id);
				if (!starredMessage) {
					console.log("STARBOARD: could not find message ID:" + reaction.message?.id);
				}
				const embed = await this.sendEmbed({ count: dbEntry.c, message: starredMessage});
				this._content[reaction.message.id].e = embed.id;
			}
		}
		this.forceSave();
	},
	async decrement(reaction) {
		let dbEntry = this._content[reaction.message.id];
		dbEntry.c--;
		if (dbEntry.e) {
			if (dbEntry.c < client.starLimit) {
				(await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
				dbEntry.e = undefined;
				if (dbEntry.c === 0) {
					delete this._content[reaction.message.id];
				}
			} else {
				const embedMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e);
				if (!embedMessage) {
					delete this._content[reaction.message.id];
				}
				embedMessage.edit({
					content: `**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf("|"))}`,
					embed: [embedMessage.embeds[0]]
				});
			}
		}
		this.forceSave();
	},
	sendEmbed(data) {
		let description = [data.message.content, ""];
		const embed = new client.embed()
			.setAuthor({name: `${data.message.member.displayName} [${data.message.author.tag}]`, iconURL: data.message.author.avatarURL({ format: "png", size: 128 })})
			.setTimestamp(data.message.createdTimestamp)
			.setFooter({text: `MSG:${data.message.id}, USER:${data.message.author.id}`})
			.addField("\u200b", `[Jump to Message](${data.message.url})`)
			.setColor("#ffcc00");
		
		// attachments
		let imageSet = false;
		data.message.embeds.forEach(x => {
			let text = `\\[[Embed](${x.url})] `;
			if (x.provider || x.author) {
				text += x.provider?.name || x.author.name;
				if (x.title) {
					text += `: ${x.title}`;
				}
			} else {
				text += x.title;
			}
			if (x.image) {
				if (imageSet) {
					
					text += `: [Image](${x.image.url})`;
				} else {
					text += ": Image";
					embed.setImage(x.image.url);
					imageSet = true;
				}
			}
			description.push(text);
		});
		data.message.attachments.forEach(attachment => {
			if (["png", "jpg", "webp", "gif", "jpeg"].some(x => attachment.url?.endsWith(x)) && !imageSet) {
				embed.setImage(data.message.attachments.first().url);
				imageSet = true;
			} else if (attachment.url) {
				let type = "File";
				if (["png", "jpg", "webp", "jpeg"].some(x => attachment.url?.endsWith(x))) type = "Image";
				if (["mp4", "mov", "webm"].some(x => attachment.url?.endsWith(x))) type = "Video";
				if (attachment.url?.endsWith("gif")) type = "Gif";
				description.push(`[Embed] ${type}: [${attachment.name}](${attachment.url})`);
			}
		});

		// trim content if oversized
		const descPreview = description.join("\n").trim();
		if (descPreview.length > 2048) {
			const diff = descPreview.length - 2048;
			description[0] = description[0].slice(0, description[0].length - Math.max(3, diff)) + "...";
		}
		embed.setDescription(description.join("\n").trim());

		// get channel, send, react
	return client.channels.resolve(client.config.mainServer.channels.starboard).send({content: `**${data.count}** :star: | ${data.message.channel.toString()}`, embeds: [embed]}).then(async x => {
			x.react("⭐");
			return x;
		});
	},
});

// event loop, for punishments and daily msgs
setInterval(() => {
	const now = Date.now();
	const lrsStart = 1638138120311;
	client.punishments._content.filter(x => x.endTime <= now && !x.expired).forEach(async punishment => {
		console.log(`${punishment.member}"s ${punishment.type} should expire now`);
		const unpunishResult = await client.punishments.removePunishment(punishment.id, client.user.id, "Time\'s up!");
		console.log(unpunishResult);
	});
	const formattedDate = Math.floor((now - lrsStart) / 1000 / 60 / 60 / 24);
	const dailyMsgs = require("./databases/dailyMsgs.json");
	if (!dailyMsgs.some(x => x[0] === formattedDate)) {
		let total = Object.values(client.userLevels._content).reduce((a, b) => a + b, 0); // sum of all users
		const yesterday = dailyMsgs.find(x => x[0] === formattedDate - 1);
		if (total < yesterday) { // messages went down
			total = yesterday;
		}
		dailyMsgs.push([formattedDate, total]);
		fs.writeFileSync(__dirname + "/databases/dailyMsgs.json", JSON.stringify(dailyMsgs));
	}
}, 5000);

modmailClient.threads = new client.collection();
modmailClient.on("messageCreate", message => {
	require("./modmailMessage.js")(message, modmailClient, client);
});
if (client.config.botSwitches.fpb) {
	client.login(client.config.token);
}
if (client.config.botSwitches.modmail) {
	modmailClient.login(client.config.modmailBotToken);
}