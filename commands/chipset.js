const { SlashCommandBuilder } = require("@discordjs/builders");

async function chipsetEmbed(client, chipset, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === "intel") color = 2793983;
	else if (manufacturer.toLowerCase() === "amd") color = 13582629;
	const embed = await new client.embed()
		.setTitle(`${manufacturer.toUpperCase() + " " + chipset.name}`)
		.addFields(
		{name: 'Supported CPUs', value: `${chipset.supported === "N/A" ? "N/A" : chipset.supported}`, inline: true},
		{name: 'Core OC', value: `${chipset.coreOC === null ? "N/A" : chipset.coreOC}`, inline: true},
		{name: 'Memory OC', value: `${chipset.memOC === null ? "N/A" : chipset.memOC}`, inline: true},
		{name: 'Memory channels', value: `${chipset.memChan === null ? "N/A" : chipset.memChan}`, inline: true},
		{name: 'PCIe lanes', value: `${chipset.pcieLanes === null ? "N/A" : chipset.pcieLanes}`, inline: true},
		{name: 'PCIe generation', value: `${chipset.pcieGen === null ? "N/A" : chipset.pcieGen}`, inline: true},
		{name: 'Socket', value: `${chipset.socket === null ? "N/A" : chipset.socket}`, inline: true})
		.setColor(color);
	return embed;
}

module.exports = {
	run: async (client, interaction) => {
		const subCmd = interaction.options.getSubcommand();
		if (subCmd === "help") {
			const embed = new client.embed()
			.setTitle("Chipset Command Help")
			.setColor(client.config.embedColor)
			.setDescription("This command searches a list of real life chipsets and supplies you with technical information about them. This guide explains how to use this command properly.")
			.addFields(
			{name: 'Search Terms', value: 'Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a commad \`,\`.'},
			{name: 'Manufacturer Search', value: 'Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `amd` or `INTEL`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.'},
			{name: 'I don\'t want to write this', value: 'so here are examples\n\`\\chipset INTEL z490\`\n2 search terms, separated with a comma\nmanufacturer = INTEL (only INTEL chipsets will be searched)\nname search = z490\n\n\`,chipset z490\`\n1 search term\nno manufacturer, no filters\nnamesearch = z490\n\n\`,chipset INTEL -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = INTEL\nmultiple search: list is active (\`-s\` also works(\`,s\` allows you to choose a cpu based on numbering, \`,sl` just shows the list))'})
			return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		} else {
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
				interaction.reply({content: `Invalid operator in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (!property || !["name", "supported", "coreoc", "memoc", "memorychannels", "pcielanes", "pciegen"].includes(property.toUpperCase())) {
				interaction.reply({content: `Invalid property in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (!value) {
				interaction.reply({content: `Invalid value in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (property === "" || property === "socket") {
				if (operator !== "=") {
					interaction.reply({content: `Invalid operator in \`${property + operator + value}\` because that property only works with \`=\` operator`, allowedMentions: { repliedUser: false }});
					return false;
				} else {
					return { property, operator, value };
				}
			} else {
				return { property, operator, value };
			}
		});
		if (filters.find(x => !x) !== undefined) return;
		const chipsets = (() => {
			if (manufacturer) {
				if (manufacturer === "intel") {
					return { intel: new client.collection(Object.entries(require("../databases/chipsetlist-INTEL.json"))) };
				} else if (manufacturer === "amd") {
					return { amd: new client.collection(Object.entries(require("../databases/chipsetlist-AMD.json"))) };
				}
			} else {
				return {
					intel: new client.collection(Object.entries(require("../databases/chipsetlist-INTEL.json"))),
					amd: new client.collection(Object.entries(require("../databases/chipsetlist-AMD.json")))
				};
			}
		})();
		function rankChipset(chipset) {
			let score = 0;
			if (nameSearch) {
				if (chipset.name.toLowerCase().replace(/ /g, "").includes(nameSearch)) {
					score += nameSearch.length / chipset.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const chipsetProperty = chipset[filter.property];
				if (typeof chipsetProperty === "number") {
					if (filter.operator === "=") {
						if (chipsetProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === "<") {
						if (chipsetProperty < parseInt(filter.value)) filtersScore += chipsetProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === ">") {
						if (chipsetProperty > parseInt(filter.value)) filtersScore += 1 / (chipsetProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === "~") {
						if (chipsetProperty >= parseInt(filter.value) * 0.8 && chipsetProperty <= parseInt(filter.value) * 1.2) {
							if (chipsetProperty >= parseInt(filter.value)) filtersScore += 1 / (chipsetProperty / parseInt(filter.value));
							else if (chipsetProperty <= parseInt(filter.value)) filtersScore += chipsetProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (chipsetProperty.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(chipsetKey) {
			if (chipsets.amd.has(chipsetKey)) return "AMD";
			else if (chipsets.intel.has(chipsetKey)) return "INTEL";
			else return undefined;
		}

		if (multipleSearch) {
			const rankedChipsets = [];
			if (manufacturer) {
				chipsets[manufacturer].filter(x => x.name).forEach((chipset, key) => {
					chipset.score = rankChipset(chipset);
					if (chipset.score < 0) return;
					rankedChipsets.push([key, chipset]);
				});
			} else {
				Object.entries(chipsets).forEach(manufacturerChipsets => {
					manufacturerChipsets[1].filter(x => x.name).forEach((chipset, key) => {
						chipset.score = rankChipset(chipset);
						if (chipset.score < 0) return;
						rankedChipsets.push([key, chipset]);
					});
				});
			}
			rankedChipsets.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle("Choose chipset")
				.setDescription("Your search returned many chipset\"s." +( multipleSearch === "s" ? " Choose one and respond with the corresponding number. (20s)" : " Here is a list of them."))
			if (manufacturer === "intel") embed.setColor(2793983);
			else if (manufacturer === "amd") embed.setColor(13582629);
			else embed.setColor(client.config.embedColor);
			let text = "";
			const sliced = rankedChipsets.slice(0, limit);
			if (filters.length === 0) sliced.sort((a, b) => a[0] < b[0]);
			sliced.forEach((chipset, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${chipset[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(chipset[0])} ${chipset[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addFields({name: '\u200b', valu: text, inline: true});
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
			if (rankedChipsets.length <= limit) {
				embed.setFooter({text: `Showing all ${rankedChipsets.length} chipsets.`})
			} else {
				embed.setFooter({text: `Showing ${limit} of ${rankedChipsets.length} chipsets.`})
			}
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			if (multipleSearch === "s") {
				const filter = x => x.author.id === interaction.user.id && parseInt(x.content)
				return interaction.replytMessages({ filter, max: 1, time: 20000, errors: ["time"]}).then(async responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return interaction.channel.send("That\"s not a valid number.");
					const embeddo = await chipsetEmbed(client, rankedChipsets[index][1], manufacturer || getManufacturer(rankedChipsets[index][0]));
					interaction.reply({embeds: [embeddo], allowedMentions: { repliedUser: false }});
				}).catch(() => interaction.channel.send("You failed."))
			}
		} else {
			Object.entries(chipsets).forEach(chipsetList => {
				if (manufacturer) {
					if (manufacturer !== chipsetList[0]) return;
				}
				chipsetList[1].filter(x => x.name).forEach((chipset, key) => {
					chipsets[chipsetList[0]].get(key).score = rankChipset(chipset);
				});
			});
			let matches = {
				intel: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === "intel") {
					matches.intel = chipsets.intel.filter(x => x.name).find(x => chipsets.intel.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === "amd") {
					matches.amd = chipsets.amd.filter(x => x.name).find(x => chipsets.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.intel = chipsets.intel.filter(x => x.name).find(x => chipsets.intel.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = chipsets.amd.filter(x => x.name).find(x => chipsets.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === "number" ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === "number" ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return interaction.reply({content: "That query returned `0` results.", allowedMentions: { repliedUser: false }});
			let color;
	if (bestMatch[0].toLowerCase() === "intel") color = 2793983;
	else if (bestMatch[0].toLowerCase() === "amd") color = 13582629;
	const embeddo = await chipsetEmbed(client, bestMatch[1], bestMatch[0])
			interaction.reply({embeds: [embeddo], allowedMentions: { repliedUser: false }});
		}
	   }
	},
	data: new SlashCommandBuilder().setName("chipset").setDescription("Gets info on a chipset.").addSubcommand((optt)=>optt.setName("help").setDescription("Gives information on the command.")).addSubcommand((optt)=>optt.setName("info").setDescription("Gets info on the requested chipset.").addStringOption((opt)=>opt.setName("query").setDescription("Querys the json for info on the chipset.").setRequired(true))),
	category: "Real Computers",
	cooldown: 7
}