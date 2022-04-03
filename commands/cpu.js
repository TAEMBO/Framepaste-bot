const { SlashCommandBuilder } = require("@discordjs/builders");

function CPUEmbed(client, CPU, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === "intel") color = 2793983;
	else if (manufacturer.toLowerCase() === "amd") color = 13582629;
	const embed = new client.embed()
		.setTitle(manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1).toLowerCase() + " " + CPU.name)
		.addFields(
		{name: 'Cores', value: `${CPU.cores}`, inline: true},
		{name: 'Base Clock Speed', value: `${CPU.base ? (CPU.base === "N/A" ? "N/A" : CPU.base + " GHz") : "N/A"}`, inline: true},
		{name: 'TDP', value: `${CPU.tdp ? (CPU.tdp === "N/A" ? "N/A" : CPU.tdp + "W") : "N/A"}`, inline: true},
		{name: 'Threads', value: `${CPU.threads ? (CPU.threads === "N/A" ? "N/A" : CPU.threads) : "N/A"}`, inline: true},
		{name: 'Boost Clock Speed', value: `${CPU.boost ? (CPU.boost === "N/A" ? "N/A" : CPU.boost + " GHz") : "N/A"}`, inline: true},
		{name: 'Socket', value: `${CPU.socket ? (CPU.socket === "N/A" ? "N/A" : CPU.socket): "N/A"}`, inline: true},
		{name: 'MSRP', value: `${CPU.price ? (CPU.price === "N/A" ? "N/A" : "$" + CPU.price.toFixed(2)) : "N/A"}`, inline: true})
		.setColor(color);
		if (CPU.igpu) embed.addFields({name: 'iGPU', value: CPU.igpu, inline: true});
	return embed;
}

module.exports = {
	run: (client, interaction) => {
		const subCmd = interaction.options.getSubcommand();
		// if they did help and didnt put anything else in the command, get help embed and send it
		if (subCmd === "help") {
			const embed = new client.embed()
			.setTitle("CPU Command Help")
			.setColor(client.config.embedColor)
			.setDescription("This command searches a list of real life CPUs and supplies you with technical information about them. This guide explains how to use this command properly.")
			.addFields(
			{name: 'Search Terms', value: 'Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a commad \`,\`.'},
			{name: 'Manufacturer Search', value: 'Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `amd` or `intel`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.'},
			{name: 'I don\'t want to write this', value: 'so here are examples\n\`\\CPU intel 9900k, price > 1000\`\n2 search terms, separated with a comma\nmanufacturer = intel (only intel CPUs will be searched)\nname search = 9900k (CPU name must include \"9900k\")\nfilter: price > 1000 (CPU msrp must be more than 1000 usd)\n\n\`,CPU 11900k\`\n1 search term\nno manufacturer, no filters\nnamesearch = 5700x (CPU name must include \"5700x\")\n\n\`\\CPU intel -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = intel\nmultiple search: list is active (\`-s\` also works)'})
			return interaction.reply({embeds: [embed], allowedMentions: {repliedUser: false}, fetchReply: true});
		} else if(subCmd === "search"){
		const searchTerms = interaction.options.getString("query").split(",");

		const multipleSearch = (() => {
			const lastArg = searchTerms[searchTerms.length - 1];
			if (lastArg.endsWith("-s")) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -2).trim();
				return "s";
			} else if (lastArg.endsWith("-sl")) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -3).trim();
				return "sl";
			} else return false;
		})();

		const firstSearchTermsParts = searchTerms[0].split(" ");

		let manufacturer = firstSearchTermsParts[0].toLowerCase() === "intel" ? "intel" : firstSearchTermsParts[0].toLowerCase() === "amd" ? "amd" : undefined;

		function operatorsIn(string) {
			return ["<", ">", "=", "~"].some(x => string.includes(x))
		}
		let filtersStart;
		const nameSearch = (() => {
			if (manufacturer) {
				if (firstSearchTermsParts[1]) {
					filtersStart = 1;
					return firstSearchTermsParts.slice(1).join(" ").toLowerCase().trim().replace(/ /g, "");
				} else {
					filtersStart = 1;
					return false;
				}
			} else {
				if (operatorsIn(searchTerms[0])) {
					filtersStart = 0;
					return false;
				}
				else {
					filtersStart = 1;
					return searchTerms[0].toLowerCase().trim().replace(/ /g, "");
				}
			}
		})();
		const filters = searchTerms.slice(filtersStart).filter(x => x.length > 0).map(filter => {
			const operatorStartIndex = ["<", ">", "=", "~"].map(x => filter.indexOf(x)).find(x => x >= 0);
			const operator = filter.slice(operatorStartIndex, operatorStartIndex + 1);
			const property = filter.slice(0, operatorStartIndex).trim();
			const value = filter.slice(operatorStartIndex + 1).trim().toLowerCase();
			if (!operator) {
				interaction.channel.send(`Invalid operator in \`${property + operator + value}\``);
				return false;
			}
			if (!property || !["cores", "threads", "base", "boost", "price", "socket", "tdp"].includes(property.toLowerCase())) {
				interaction.channel.send(`Invalid property in \`${property + operator + value}\``);
				return false;
			}
			if (!value) {
				interaction.channel.send(`Invalid value in \`${property + operator + value}\``);
				return false;
			}
			if (property === "threads" || property === "cores" || property === "base" || property === "boost" || property === "price" || property === "socket" || property === "tdp") {
				if (operator !== "=") {
					interaction.channel.send(`Invalid operator in \`${property + operator + value}\` because that property only works with \`=\` operator`);
					return false;
				} else {
					return { property, operator, value };
				}
			} else {
				return { property, operator, value };
			}
		});
		if (filters.find(x => !x) !== undefined) return;
		const CPUs = (() => {
			if (manufacturer) {
				if (manufacturer === "intel") {
					return { intel: new client.collection(Object.entries(require("../databases/cpulist-INTEL.json"))) };
				} else if (manufacturer === "amd") {
					return { amd: new client.collection(Object.entries(require("../databases/cpulist-AMD.json"))) };
				}
			} else {
				return {
					intel: new client.collection(Object.entries(require("../databases/cpulist-INTEL.json"))),
					amd: new client.collection(Object.entries(require("../databases/cpulist-AMD.json")))
				};
			}
		})();
		function rankCPU(CPU) {
			let score = 0;
			if (nameSearch) {
				if (CPU.name.toLowerCase().replace(/ /g, "").includes(nameSearch)) {
					score += nameSearch.length / CPU.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const CPUProperty = CPU[filter.property];
				if (typeof CPUProperty === "number") {
					if (filter.operator === "=") {
						if (CPUProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === "<") {
						if (CPUProperty < parseInt(filter.value)) filtersScore += CPUProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === ">") {
						if (CPUProperty > parseInt(filter.value)) filtersScore += 1 / (CPUProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === "~") {
						if (CPUProperty >= parseInt(filter.value) * 0.8 && CPUProperty <= parseInt(filter.value) * 1.2) {
							if (CPUProperty >= parseInt(filter.value)) filtersScore += 1 / (CPUProperty / parseInt(filter.value));
							else if (CPUProperty <= parseInt(filter.value)) filtersScore += CPUProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (`${CPUProperty}`.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(CPUKey) {
			if (CPUs.amd.has(CPUKey)) return "AMD";
			else if (CPUs.intel.has(CPUKey)) return "INTEL";
			else return undefined;
		}

		if (multipleSearch) {
			const rankedCPUs = [];
			if (manufacturer) {
				CPUs[manufacturer].filter(x => x.name).forEach((CPU, key) => {
					CPU.score = rankCPU(CPU);
					if (CPU.score < 0) return;
					rankedCPUs.push([key, CPU]);
				});
			} else {
				Object.entries(CPUs).forEach(manufacturerCPUs => {
					manufacturerCPUs[1].filter(x => x.name).forEach((CPU, key) => {
						CPU.score = rankCPU(CPU);
						if (CPU.score < 0) return;
						rankedCPUs.push([key, CPU]);
					});
				});
			}
			rankedCPUs.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle("Choose CPU")
				.setDescription("Your search returned many CPU\"s." +( multipleSearch === "s" ? " Choose one and respond with the corresponding number. (20s)" : " Here is a list of them."))
			if (manufacturer === "intel") embed.setColor(2793983);
			else if (manufacturer === "amd") embed.setColor(13582629);
			else embed.setColor(client.config.embedColor);
			let text = "";
			const sliced = rankedCPUs.slice(0, limit);
			if (filters.length === 0) sliced.sort((a, b) => a[0] < b[0]);
			sliced.forEach((CPU, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${CPU[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(CPU[0])} ${CPU[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addFields({name: '\u200b', value: text, inline: true});
					text = "";
				}
				text += textAddition;
			});
			if (text.length > 0) {
				if (embed.fields.length > 0) {
					embed.addFields({name: '\u200b', value: text, inline: true});
				} else {
					embed.description += "\n" + text;
				}
			}
			if (rankedCPUs.length <= limit) {
				embed.setFooter({text: `Showing all ${rankedCPUs.length} CPUs.`})
			} else {
				embed.setFooter({text: `Showing ${limit} of ${rankedCPUs.length} CPUs.`})
			}
			interaction.reply({embeds: [embed]});
			if (multipleSearch === "s") {
				const filter = x => x.author.id === interaction.user.id && parseInt(x.content)
				return interaction.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ["time"]}).then(responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return interaction.channel.send("That\"s not a valid number.");
					interaction.followUp({embeds: [CPUEmbed(client, rankedCPUs[index][1], manufacturer || getManufacturer(rankedCPUs[index][0]))]});
				}).catch(() => interaction.channel.send("You failed."))
			}
		} else {
			Object.entries(CPUs).forEach(CPUList => {
				if (manufacturer) {
					if (manufacturer !== CPUList[0]) return;
				}
				CPUList[1].filter(x => x.name).forEach((CPU, key) => {
					CPUs[CPUList[0]].get(key).score = rankCPU(CPU);
				});
			});
			let matches = {
				intel: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === "intel") {
					matches.intel = CPUs.intel.filter(x => x.name).find(x => CPUs.intel.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === "amd") {
					matches.amd = CPUs.amd.filter(x => x.name).find(x => CPUs.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.intel = CPUs.intel.filter(x => x.name).find(x => CPUs.intel.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = CPUs.amd.filter(x => x.name).find(x => CPUs.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === "number" ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === "number" ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return interaction.reply({content: "That query returned `0` results.", ephemeral: true});
			interaction.reply({embeds: [CPUEmbed(client, bestMatch[1], bestMatch[0])]});
		}
	}
	},
	data: new SlashCommandBuilder().setName("cpu").setDescription("Finds a CPU.").addSubcommand((optt)=>optt.setName("help").setDescription("Shows you how to use the command.")).addSubcommand((optt)=>optt.setName("search").setDescription("Searches the db for the queried CPU.").addStringOption((opt)=>opt.setName("query").setDescription("The CPU to query for.").setRequired(true)))
}