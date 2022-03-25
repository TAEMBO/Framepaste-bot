const {Client} = require("discord.js");
const Discord = require("discord.js");
const fs = require("node:fs");
const {FreeStuffApi} = require("freestuff");
const database = require("./database");
const {GiveawaysManager} = require("discord-giveaways");
class YClient extends Client {
    constructor(options){
        super({
            intents: Object.keys(Discord.Intents.FLAGS),
            partials: ["MESSAGE", "REACTION", "CHANNEL"],
            disableEveryone: true
        })
        this.invites = new Map();
        this.config = require("./config.json");
        this.tokens = require("./tokens.json");
        this.frs = new FreeStuffApi({key: this.tokens.fsApiKey});
        this.memeQueue = new Discord.Collection;
        this.embed = Discord.MessageEmbed;
        this.collection = Discord.Collection;
        this.messageCollector = Discord.MessageCollector;
        this.messageattachment = Discord.MessageAttachment;
        this.cpulist = {
            INTEL: JSON.parse(fs.readFileSync(__dirname + "/databases/cpulist-INTEL.json")),
            AMD: JSON.parse(fs.readFileSync(__dirname + "/databases/cpulist-AMD.json")),
        };
        this.memberCount_LastGuildFetchTimestamp = 0;
        this.starLimit = 3;
        this.selfStarAllowed = false;
        this.giveawaysManager = new GiveawaysManager(this, {
            storage: "./databases/giveaways.json",
            updateCountdownEvery: 5000,
            default: {
                botsCanWin: false,
                embedColor: this.config.embedColor,
                embedColorEnd: 14495300,
                reaction: "🎉"
            }
        });
        this.games = new Discord.Collection();
        this.commands = new Discord.Collection();
        this.registery = [];
        this.setMaxListeners(100)
        this.bannedWords = new database("./databases/bannedWords.json", "array");
        this.tictactoeDb = new database("./databases/ttt.json", "array");
        this.userLevels = new database("./databases/userLevels.json", "object");
        this.dmForwardBlacklist = new database("./databases/dmforwardblacklist.json", "array");
        this.punishments = new database("./databases/punishments.json", "array");
        this.specsDb = new database("./databases/specs.json", "object");
        this.votes = new database("./databases/suggestvotes.json", "array");
        this.starboard = new database("./databases/starboard.json", "object");
        this.repeatedMessages = {};
        this.repeatedMessagesContent = new database("./databases/repeatedMessagesContent.json", "array");
        this.modmailClient = new Discord.Client({ disableEveryone: true, intents: Object.keys(Discord.Intents.FLAGS), partials: ["MESSAGE", "REACTION", "CHANNEL"]});
        this.modmailClient.threads = new Discord.Collection();
    }
    async init(){
        this.login(this.tokens.token);
        this.bannedWords.initLoad();
        this.tictactoeDb.initLoad().intervalSave();
        this.userLevels.initLoad().intervalSave(15000).disableSaveNotifs();
        this.dmForwardBlacklist.initLoad();
        this.punishments.initLoad();
        this.specsDb.initLoad().intervalSave(15000);
        this.votes.initLoad();
        this.starboard.initLoad().intervalSave(60000);
        this.repeatedMessagesContent.initLoad();
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
	        const command = require(`./commands/${file}`);
	        this.commands.set(command.data.name, command);
	        this.registery.push(command.data.toJSON())
           }
           this.commands.get("ping").spammers = new this.collection();
        if (this.config.botSwitches.modmail) {
            this.modmailClient.login(this.tokens.modmailBotToken);
        }
    }
    async cpuCommand(client, interaction, manufacture){
        async function cpuEmbed(client, options){
            const { cpu, manufacturer, color } = options;
            const embed = new client.embed()
                .setTitle(manufacturer + ' ' + cpu.name)
                .addField('Cores', `${cpu.cores}`, true)
                .addField('Base Clock Speed', `${cpu.base ? (cpu.base === 'N/A' ? 'N/A' : cpu.base + ' GHz') : 'N/A'}`, true)
                .addField('TDP', `${cpu.tdp ? (cpu.tdp === 'N/A' ? 'N/A' : cpu.tdp + 'W') : 'N/A'}`, true)
                .addField('Threads', `${cpu.threads ? (cpu.threads === 'N/A' ? 'N/A' : cpu.threads) : 'N/A'}`, true)
                .addField('Boost Clock Speed', `${cpu.boost ? (cpu.boost === 'N/A' ? 'N/A' : cpu.boost + ' GHz') : 'N/A'}`, true)
                .addField('Socket', `${cpu.socket ? (cpu.socket === 'N/A' ? 'N/A' : cpu.socket): 'N/A'}`, true)
                .addField('MSRP', `${cpu.price ? (cpu.price === 'N/A' ? 'N/A' : '$' + cpu.price.toFixed(2)) : 'N/A'}`, true)
                .setColor(color);
                if (cpu.igpu) embed.addField('iGPU', cpu.igpu, true);
            return embed;
        }
        const subCmd = interaction.options.getSubcommand();
	if (subCmd === "help") {
		const embed = new client.embed()
		.setTitle('CPU Command Help')
		.setDescription('This command searches a list of real life CPUs and supplies you with technical information about them. This guide explains how to use this command properly.')
		.addField('Name Search', `Name Search is the easiest method to find a specific CPU. The syntax of name search is \`${interaction.commandName} [CPU name]\`. CPU name is text that can include spaces but not commas. This text is transformed into all lowercase letters and matched with lowercase CPU names. Matches are assigned a value based on how well they match the search, if at all. This formula is \`Search length / CPU name length\`. Name search is optional when at least 1 filter is present.`)
		.addField('Filters', `Filters are a method to narrow down a big list of CPUs. The syntax of filters is \`[Property] [Operator] [Value]\` where Property is one of "cores", "threads", "base", "boost", "price", "socket" or "tdp". Operator is one of <, >, =, ~. Value is an integer, decimal number or text (can contain numbers, e.g. LGA 1200). Filters must be separated with a comma \`,\` A comma must also be added after Name Search, between Name Search and the first Filter.`)
		.addField('Filters - Part 2', `If the Property is "socket", < and > are not allowed and ~ matches CPUs with sockets that start with the text part of Value (Substring of Value, starting at the first character and ending at the first number, or ending of string, whichever comes first) If the Operator is ~, matches' Property must be ±20% of Value. Price is always measured in USD. Boost and base clocks are always measured in GHz. If you want to filter by price or clock speed, enter only an integer or decimal number without any GHz or Dollar signs. For decimal numbers, use \`.\`, e.g. \`price = 249.99\` matches CPUS which's price is equal to 249.99 USD ($).`)
		.addField('Multiple Search', `Multiple Search is a way to receive a list of CPU names and choose the one you want to learn more about. Multiple Search is activated when you add \`-s\` to the end of the command. Multiple Search orders all matches by best matches first and responds with all or 200 best matches and attaches a number to each one. If Name Search is active, matches are ordered by the assigned value of how well they match the CPU's name. If Name Search is not active, matches are ordered alphabetically. You can choose your preferred CPU by sending a interaction with a valid number. A valid number is an integer within the constraints given by the bot.`)
		.addField('Multiple Search: List', 'This variation of Multiple Search works exactly like Multiple Search, except it does not require you to select and respond with a valid number from the list of CPUs. Multiple Search: List is activated when you add \`-sl\` to the end of the command, instead of \`-s\` which is used for Multiple Search. This variation provides a list of CPUs that match the filters and/or Name Search with the same rules as Multiple Search. The purpose of this variation is to make it possible to find out e.g. how many CPUs exist in a given category.')
		.setColor(client.config.embedColor)
		return interaction.reply({embeds: [embed], ephemeral: true});
	} else if(subCmd === "search"){
	const manufacturer = `${manufacture}`.toUpperCase();
	const color = manufacturer === 'INTEL' ? 2793983 : 13582629;
	const search = interaction.options.getString("query").toLowerCase().split(',');
	let matches = new client.collection();
	let nameSearch = false;
	let filters = [];
	let oneResult = true;
	let multipleResponseAsk = true;
	if (search[search.length - 1].endsWith('-s')) {
		oneResult = false;
		search[search.length - 1] = search[search.length - 1].slice(0, -2).trim();
	} else if (search[search.length - 1].endsWith('-sl')) {
		oneResult = false;
		multipleResponseAsk = false;
		search[search.length - 1] = search[search.length - 1].slice(0, -3).trim();
	}
	let prematureError = false;
	search.forEach((statement, index) => {
		statement = statement.trim();
		if (index === 0 && !['<', '>', '=', '~'].some(x => statement.includes(x))) {
			nameSearch = search[0].replace(/ /g, '-');
		} else {
			const operatorStartIndex = Math.max(statement.indexOf('<'), 0) || Math.max(statement.indexOf('>'), 0) || Math.max(statement.indexOf('='), 0) || Math.max(statement.indexOf('~'), 0);
			let operator = statement.slice(operatorStartIndex, operatorStartIndex + 1);
			if (operator === '=') operator = '===';
			let property = statement.slice(0, operatorStartIndex).trim();
			let value = statement.slice(operatorStartIndex + 1).trim();
			if (property === 'socket') {
				if (['<', '>'].includes(operator)) {
					prematureError = true;
					return interaction.reply({content: `Invalid operator in \`${statement}\``, ephemeral: true});
				}
				if (operator === '~') return filters.push(`cpu[1].socket.toLowerCase().startsWith('${value.toLowerCase().slice(0, value.indexOf(/[0-9]/) ? value.indexOf(/[0-9]/) : value.indexOf(' ') ? value.indexOf(' ') : value.length)}')`);
				if (operator === '===') return filters.push(`cpu[1].socket.toLowerCase()==='${value.toLowerCase()}'`);
			}
			if (operator === '~') filters.push('cpu[1].' + property + '>=' + (value * 0.8) + '&&cpu[1].' + property + '<=' + (value * 1.2));
			else filters.push('cpu[1].' + property + operator + value);
		}
	});
	Object.entries(client.cpulist[manufacturer]).forEach(cpu => {
		if (!cpu[1].name) return;
		if (nameSearch) {
			if (cpu[1].name.toLowerCase().replace(/ /g, '-').includes(nameSearch)) {
				matches.set(cpu[0], nameSearch.length / cpu[1].name.length);
			} else {
				matches.set(cpu[0], false);
			}
		} else {
			matches.set(cpu[0], 1);
		}
		if (!filters.every((x, i) => {
			try {
				return eval(x);
			} catch (error) {
				if (!prematureError) {
					prematureError = true;
					let errorSearchFilter;
					if (nameSearch) errorSearchFilter = search[i + 1];
					else errorSearchFilter = search[i];
					interaction.channel.send(`Invalid property, operator or value in \`${errorSearchFilter.trim()}\``);
				}
				return false;
			}
		})) {
			matches.set(cpu[0], false);
		}
	});
	if (prematureError) return;
	if (matches.filter(x => x).size === 0) return interaction.reply({content: 'That query returned `0` results!', ephemeral: true});
	if (oneResult) {
		const cpu = await client.cpulist[manufacturer][matches.filter(x => x).sort((a, b) => b - a).firstKey()];
		const e = await cpuEmbed(client, { cpu, manufacturer, color })
		interaction.reply({embeds: [e]});
	} else {
		const limit = 200;
		const eeao = await matches.filter(x => x)
		const bestMatches = nameSearch ? eeao.sort((a, b) => b - a).firstKey(limit) : eeao.sort((a, b) => b - a).firstKey(limit) //slice(0, limit);
		let text = ['']
		bestMatches.forEach((x, i) => {
			const cpuName = `\`${i}: ${client.cpulist[manufacturer][x].name}\`\n`;
			if (text[text.length - 1].length + cpuName.length <= 1024) text[text.length - 1] += cpuName;
			else text.push(cpuName);
		});
		const embed = new client.embed()
			.setTitle('Choose CPU')
			.setDescription(`Your search returned many CPUs. ${multipleResponseAsk ? 'Respond with the corresponding number to learn more about a specific cpu.' : 'Here is a list of them.'}`)
			.setFooter({text: matches.filter(x => x).size > limit ? 'Showing ' + limit + ' best matches of ' + matches.filter(x => x).size + ' total matches.' : 'Showing all ' + matches.filter(x => x).size + ' matches.'}).setColor(color)
		text.forEach((x, i) => {
			embed.addField('Page ' + (i), x, true);
		});
		interaction.reply({embeds: [embed]}).then(async embedMessage => {
			if (!multipleResponseAsk) return;
			const filter = m => m.author.id === interaction.user.id;
			interaction.channel.awaitMessages({ filter, max: 1, time: 40000, errors: ['time'] }).then(async collected => {
				const index = parseInt(collected.first().content);
				if (!typeof index === Number) return;
				const cpu = await client.cpulist[manufacturer][bestMatches[index]];
				const ee = await cpuEmbed(client, {cpu, manufacturer, color})
				interaction.followUp({embeds: [ee]});
			}).catch(err => interaction.followUp('Invalid response.'));
		});
	}
    }
    }
    alignText(text, length, alignment, emptyChar = ' ') {
        if (alignment === 'right') {
            text = emptyChar.repeat(length - text.length) + text;
        } else if (alignment === 'middle') {
            const emptyCharsPerSide = (length - text.length) / 2;
            text = emptyChar.repeat(Math.floor(emptyCharsPerSide)) + text + emptyChar.repeat(Math.floor(emptyCharsPerSide));
        } else {
            text = text + emptyChar.repeat(length - text.length);
        }
        return text;
    }
    commandInfo(client, command, options = { insertNewline: false, parts: [], titles: [] }) {
        let text = ':small_blue_diamond: ';
        if (!options.titles) options.titles = [];
        function e() {
            text += '\n';
            if (options.insertNewline) {
                text += '\n';
            }
            return;
        }
        if (options.parts.includes('name') && command.name) {
            if (options.titles.includes('name') && options.titles.includes('usage')) {
                text += 'Name & Usage: ';
            } else if (options.titles.includes('name')) {
                text += 'Name: ';
            }
            text += '/' + command.name;
            if (options.parts.includes('usage') && command.usage) {
                text += ' ' + command.usage.map(x => x.startsWith('?') ? '?[' + x.slice(1) + ']' : '[' + x + ']').join(' ');
            }
            text += '`';
            e();
        } else if (options.parts.includes('usage') && command.usage) {
            if (options.titles.includes('usage')) text += 'Usage: ';
            text += '`' + command.usage.map(x => x.startsWith('?') ? '?[' + x + ']' : '[' + x + ']').join(' ') + '`';
            e();
        }
        if (options.parts.includes('description') && command.description) {
            if (options.titles.includes('description')) text += 'Description: ';
            text += command.description;
            e();
        }
        if (options.parts.includes('shortDescription')) {
            if (command.shortDescription) {
                if (options.titles.includes('shortDescription')) text += 'Shorter description: ';
                text += command.shortDescription;
                e();
            } else if (!options.titles.includes('shortDescription') && command.description) {
                text += command.description;
                e();
            }
        }
        if (options.parts.includes('alias') && command.alias) {
            if (options.titles.includes('alias')) text += 'Aliases: ';
            text += command.alias.map(x => '`' + x + '`').join(', ');
            e();
        }
        if (options.parts.includes('category') && command.category) {
            if (options.titles.includes('category')) text += 'Category: ';
            text += command.category;
            e();
        }
        if (options.parts.includes('autores') && command.autores) {
            if (options.titles.includes('autores')) text += 'AutoResponse:tm: Requirements: ';
            text += '`[' + command.autores.join('] [') + ']`';
            e();
        }
        if (options.parts.includes('cooldown') && command.cooldown) {
            if (options.titles.includes('cooldown')) text += 'Cooldown: ';
            text += client.formatTime(command.cooldown * 1000, 1, { longNames: true });
            e();
        }
        e();
        return text;
    };
    createTable(columnTitles = [], rowsData = [], options = {}, client) {
        const rows = [];
        // { columnAlign: [], columnSeparator: [], columnEmptyChar: [] }
        let { columnAlign = [], columnSeparator = [], columnEmptyChar = [] } = options;
        if (columnSeparator.length < 1) columnSeparator.push('|');
        columnSeparator = columnSeparator.map(x => ' ' + x + ' ');
        // column widths
        const columnWidths = columnTitles.map((title, i) => Math.max(title.length, ...rowsData.map(x => x[i].length)));
        // first row
        rows.push(columnTitles.map((title, i) => {
            let text = client.alignText(title, columnWidths[i], columnAlign[i], columnEmptyChar[i]);
            if (columnSeparator[i]) {
                text += ' '.repeat(columnSeparator[i].length);
            }
            return text;
        }).join(''));
        // big line
        rows.push('━'.repeat(rows[0].length));
        // data
        // remove unicode
        rowsData.map(row => {
            return row.map(element => {
                return element.split('').map(char => {
                    if (char.charCodeAt(0) > 128) return '□';
                }).join('');
            });
        });
        rows.push(rowsData.map(row => row.map((element, i) => {
                return client.alignText(element, columnWidths[i], columnAlign[i], columnEmptyChar[i]) + (i === columnTitles.length - 1 ? '' : columnSeparator[i]);
            }).join('')
        ).join('\n'))
    
        return rows.join('\n');
    }
    displaySpecs(client, member) {
        const embed = new client.embed()
            .setAuthor({name: `${member.displayName} (${member.user.id})`, iconURL: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
            .setTitle(`Specs`)
            .setDescription(`These are their computer specs. Use \`/specifications help\` to learn more about this command.`)
            .setColor(client.config.embedColor)
        const specs = client.specsDb.getUser(member.user.id);
        Object.entries(specs).forEach(spec => {
            embed.addField(spec[0], spec[1]);
        });
        return embed;
    };
    format24hClock(timestamp, includeSeconds = false) {
        if (!(timestamp instanceof Date)) timestamp = new Date(timestamp);
        let text = '';
        text += ('0' + timestamp.getUTCHours()).slice(-2) + ':';
        text += ('0' + timestamp.getUTCMinutes()).slice(-2);
        if (includeSeconds) {
            text += '.' + ('0' + timestamp.getUTCSeconds()).slice(-2)
        }
        return text;
    };
    formatPunishmentType(punishment, client, cancels) {
        if (punishment.type === 'removeOtherPunishment') {
            cancels ||= this.punishments._content.find(x => x.id === punishment.cancels)
            return cancels.type[0].toUpperCase() + cancels.type.slice(1) + ' Removed';
        } else return punishment.type[0].toUpperCase() + punishment.type.slice(1);
    }
    formatTime(integer, accuracy = 1, options = {}) {
        const timeNames = require('./timeNames.js');
        let achievedAccuracy = 0;
        let text = '';
        const { longNames, commas } = options;
        for (const timeName of timeNames) {
            if (achievedAccuracy < accuracy) {
                const fullTimelengths = Math.floor(integer / timeName.length);
                if (fullTimelengths === 0) continue;
                achievedAccuracy++;
                text += fullTimelengths + (longNames ? (' ' + timeName.name + (fullTimelengths === 1 ? '' : 's')) : timeName.name.slice(0, timeName.name === 'month' ? 2 : 1)) + (commas ? ', ' : ' ');
                integer -= fullTimelengths * timeName.length;
            } else {
                break;
            }
        }
        if (text.length === 0) text = integer + (longNames ? ' milliseconds' : 'ms') + (commas ? ', ' : '');
        if (commas) {
            text = text.slice(0, -2);
            if (longNames) {
                text = text.split('');
                text[text.lastIndexOf(',')] = ' and';
                text = text.join('');
            }
        }
        return text.trim();
    };
    hasModPerms(client, guildMember) {
        return this.config.mainServer.staffRoles.map(x => this.config.mainServer.roles[x]).some(x => guildMember.roles.cache.has(x));
    };
    makeModlogEntry(data, client) {
        const cancels = data.cancels ? client.punishments._content.find(x => x.id === data.cancels) : null;
    
        // format data into embed
        const embed = new this.embed()
            .setTitle(`${this.formatPunishmentType(data, client, cancels)} | Case #${data.id}`)
            .addField(':small_blue_diamond: User', `<@${data.member}> \`${data.member}\``, true)
            .addField(':small_blue_diamond: Moderator', `<@${data.moderator}> \`${data.moderator}\``, true)
            .addField('\u200b', '\u200b', true)
            .addField(':small_blue_diamond: Reason', `\`${data.reason || 'unspecified'}\``, true)
            .setColor(this.config.embedColor)
            .setTimestamp(data.time)
        if (data.duration) {
            embed
                .addField(':small_blue_diamond: Duration', client.formatTime(data.duration, 100), true)
                .addField('\u200b', '\u200b', true)
        }
        if (data.cancels) embed.addField(':small_blue_diamond: Overwrites', `This case overwrites Case #${cancels.id} \`${cancels.reason}\``);
    
        // send embed in modlog channel
        client.channels.cache.get(client.config.mainServer.channels.caselogs).send({embeds: [embed]});
    };
    parseTime(string) {
        if (!string) return 0;
        const expressions = string.split(' ');
        let milliseconds = 0;
        const timeNames = require("./timeNames.js");
        expressions.forEach(expression => {
            const int = parseInt(expression);
            const identifier = expression.match(/[A-Z]/gi).join('').toLowerCase();
            if (!int || !identifier) return;
            const bestMatch = timeNames.find(x => x.name.startsWith(identifier));
            if (bestMatch) { // indentifier is a partial or whole timeName
                if (identifier === 'm') { // month and minute both start with m, if m is provided, prefer minutes
                    milliseconds += int * timeNames.find(x => x.name === 'minute').length;
                } else milliseconds += int * bestMatch.length;
            }
            return;
        });
        return milliseconds;
    }
    async punish(client, interaction, type) {
        if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, ephemeral: true, allowedMentions: {roles: false}});
        if (type !== 'warn' && interaction.member.roles.cache.has(client.config.mainServer.roles.trialmoderator)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, ephemeral: true, allowedMentions: {roles: false}});
        const member = interaction.options.getMember("member");
        const time = interaction.options.getString("time");
        const reason = interaction.options.getString("reason") ?? "None";
        const result = await client.punishments.addPunishment(type, member, { time, reason, interaction }, interaction.user.id);
        if(typeof result !== String){
            interaction.reply({embeds: [result]});
        } else {
            interaction.reply({content: `${result}`})
        }
    };
    async unPunish(client, interaction) {
        if (!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, ephemeral: true, allowedMentions: {roles: false}});
        const punishment = client.punishments._content.find(x => x.id == interaction.options.getInteger("id"));
        if (!punishment) return interaction.reply({content: "that isn't a valid case ID.", ephemeral: true});
        if (punishment.type !== 'warn' && interaction.member.roles.cache.has(client.config.mainServer.roles.trialmoderator)) return interaction.reply({content: 'Trial moderators can only remove warnings.', ephemeral: true, allowedMentions: {roles: false}});
        const reason = interaction.options.getString("reason") ?? "None";
        const unpunishResult = await client.punishments.removePunishment(punishment.id, interaction.user.id, reason);
        interaction.reply(unpunishResult);
    };
}
module.exports = YClient;
