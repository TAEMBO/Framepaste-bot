const { SlashCommandBuilder } = require('@discordjs/builders');

function gpuEmbed(client, gpu, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === 'nvidia') color = 7715072;
	else if (manufacturer.toLowerCase() === 'amd') color = 13582629;
	const embed = new client.embed()
		.setTitle(manufacturer.toUpperCase() + ' ' + gpu.name)
		.addFields(
		{name: 'Memory Interface', value: gpu.memoryInterface === 'N/A' ? 'N/A' : gpu.memoryInterface + '-bit', inline: true},
		{name: 'Memory Size', value: gpu.vram === 'N/A' ? 'N/A' : gpu.vram >= 1024 ? gpu.vram / 1024 + 'GB' : gpu.vram + 'MB', inline: true},
		{name: 'Memory Type', value: gpu.vramType === 'N/A' ? 'N/A' : gpu.vramType, inline: true},
		{name: 'Power Connectors', value: gpu.powerConnectors === 'N/A' ? 'N/A' : parseInt(gpu.powerConnectors) ? gpu.powerConnectors + ' pin' : gpu.powerConnectors, inline: true},
		{name: 'TDP', value: gpu.tdp === 'N/A' ? 'N/A' : gpu.tdp + 'W', inline: true},
		{name: 'MSRP', value: gpu.price === 'N/A' ? 'N/A' : '$' + gpu.price + ' USD', inline: true}
		)
		.setColor(color)
		.setImage(`https://gpus.yessar.xyz/r/${gpu.name.replaceAll(" ", "-").toLowerCase()}.png`);
	if (gpu.pcieLink) embed.addFields({name: 'PCIe Link', value: `PCIe ${gpu.pcieLink}`, inline: true});
	return embed;
}

module.exports = {
	run: (client, interaction) => {
		const subCmd = interaction.options.getSubcommand();
		if (subCmd === "help") {
			const embed = new client.embed()
			.setTitle('GPU Command Help')
			.setColor(client.config.embedColor)
			.setDescription('This command searches a list of real life GPUs and supplies you with technical information about them. This guide explains how to use this command properly.')
			.addFields(
			{name: 'Search Terms', value: 'Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a commad \`,\`.'},
			{name: 'Manufacturer Search', value: 'Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `amd` or `nvidia`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.'},
			{name: 'I don\'t want to write this', value: 'so here are examples\n\`,gpu nvidia 3080, price > 1000\`\n2 search terms, separated with a comma\nmanufacturer = nvidia (only nvidia gpus will be searched)\nname search = 3080 (gpu name must include "3080")\nfilter: price > 1000 (gpu msrp must be more than 1000 usd)\n\n\`,gpu 6900\`\n1 search term\nno manufacturer, no filters\nnamesearch = 6900 (gpu name must include "6900")\n\n\`,gpu nvidia -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = nvidia\nmultiple search: list is active (\`-s\` also works)'})
			return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		} else if(subCmd === "search"){
			let searchTerms = interaction.options.getString("query")

			const options = interaction.options.getString('options');

			searchTerms = searchTerms.toString().replaceAll('-sl', '').replaceAll('-s', '')

			switch (options) {
				case 'none':
					break
				case 'sl':
					searchTerms = searchTerms + ' -sl'
					break
				case 's':
					searchTerms = searchTerms + ' -s'
					break
			}

			searchTerms = searchTerms.toLowerCase().split(",")

		const multipleSearch = (() => {
			const lastArg = searchTerms[searchTerms.length - 1];
			if (lastArg.endsWith('-s')) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -2).trim();
				return 's';
			} else if (lastArg.endsWith('-sl')) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -3).trim();
				return 'sl';
			} else return false;
		})();

		const firstSearchTermsParts = searchTerms[0].split(' ');

		let manufacturer = firstSearchTermsParts[0].toLowerCase() === 'nvidia' ? 'nvidia' : firstSearchTermsParts[0].toLowerCase() === 'amd' ? 'amd' : undefined;

		function operatorsIn(string) {
			return ['<', '>', '=', '~'].some(x => string.includes(x))
		}
		let filtersStart;
		const nameSearch = (() => {
			if (manufacturer) {
				if (firstSearchTermsParts[1]) {
					filtersStart = 1;
					return firstSearchTermsParts.slice(1).join(' ').toLowerCase().trim().replace(/ /g, '');
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
					return searchTerms[0].toLowerCase().trim().replace(/ /g, '');
				}
			}
		})();
		const filters = searchTerms.slice(filtersStart).filter(x => x.length > 0).map(filter => {
			const operatorStartIndex = ['<', '>', '=', '~'].map(x => filter.indexOf(x)).find(x => x >= 0);
			const operator = filter.slice(operatorStartIndex, operatorStartIndex + 1);
			const property = filter.slice(0, operatorStartIndex).trim();
			const value = filter.slice(operatorStartIndex + 1).trim().toLowerCase();
			if (!operator) {
				interaction.reply({content: `Invalid operator in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (!property || !['name', 'price', 'memoryinterface', 'vram', 'vramtype', 'powerconnectors', 'tdp'].includes(property.toLowerCase())) {
				interaction.reply({content: `Invalid property in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (!value) {
				interaction.reply({content: `Invalid value in \`${property + operator + value}\``, allowedMentions: { repliedUser: false }});
				return false;
			}
			if (property === 'vramtype' || property === 'powerconnectors') {
				if (operator !== '=') {
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
		const gpus = (() => {
			if (manufacturer) {
				if (manufacturer === 'nvidia') {
					return { nvidia: new client.collection(Object.entries(require('../databases/gpulist-NVIDIA.json'))) };
				} else if (manufacturer === 'amd') {
					return { amd: new client.collection(Object.entries(require('../databases/gpulist-AMD.json'))) };
				}
			} else {
				return {
					nvidia: new client.collection(Object.entries(require('../databases/gpulist-NVIDIA.json'))),
					amd: new client.collection(Object.entries(require('../databases/gpulist-AMD.json')))
				};
			}
		})();
		function rankGpu(gpu) {
			let score = 0;
			if (nameSearch) {
				if (gpu.name.toLowerCase().replace(/ /g, '').includes(nameSearch)) {
					score += nameSearch.length / gpu.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const gpuProperty = gpu[filter.property];
				if (typeof gpuProperty === 'number') {
					if (filter.operator === '=') {
						if (gpuProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === '<') {
						if (gpuProperty < parseInt(filter.value)) filtersScore += gpuProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === '>') {
						if (gpuProperty > parseInt(filter.value)) filtersScore += 1 / (gpuProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === '~') {
						if (gpuProperty >= parseInt(filter.value) * 0.8 && gpuProperty <= parseInt(filter.value) * 1.2) {
							if (gpuProperty >= parseInt(filter.value)) filtersScore += 1 / (gpuProperty / parseInt(filter.value));
							else if (gpuProperty <= parseInt(filter.value)) filtersScore += gpuProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (gpuProperty.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(gpuKey) {
			if (gpus.amd.has(gpuKey)) return 'AMD';
			else if (gpus.nvidia.has(gpuKey)) return 'NVIDIA';
			else return undefined;
		}

		if (multipleSearch) {
			const rankedGpus = [];
			if (manufacturer) {
				gpus[manufacturer].filter(x => x.name).forEach((gpu, key) => {
					gpu.score = rankGpu(gpu);
					if (gpu.score < 0) return;
					rankedGpus.push([key, gpu]);
				});
			} else {
				Object.entries(gpus).forEach(manufacturerGpus => {
					manufacturerGpus[1].filter(x => x.name).forEach((gpu, key) => {
						gpu.score = rankGpu(gpu);
						if (gpu.score < 0) return;
						rankedGpus.push([key, gpu]);
					});
				});
			}
			rankedGpus.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle('Choose GPU')
				.setDescription('Your search returned many GPU\'s.' +( multipleSearch === 's' ? ' Choose one and respond with the corresponding number. (20s)' : ' Here is a list of them.'))
			if (manufacturer === 'nvidia') embed.setColor('75b900');
			else if (manufacturer === 'amd') embed.setColor(13582629);
			else embed.setColor(client.config.embedColor);
			let text = '';
			const sliced = rankedGpus.slice(0, limit);
			if (filters.length === 0) sliced.sort((a, b) => a[0] < b[0]);
			sliced.forEach((gpu, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${gpu[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(gpu[0])} ${gpu[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addFields({name: '\u200b', value: text, inline: true});
					text = '';
				}
				text += textAddition;
			});
			if (text.length > 0) {
				if (embed.fields.length > 0) {
					embed.addFields({name: '\u200b', value: text, inline: true});
				} else {
					embed.description += '\n' + text;
				}
			}
			if (rankedGpus.length <= limit) {
				embed.setFooter({text: `Showing all ${rankedGpus.length} GPUs.`})
			} else {
				embed.setFooter({text: `Showing ${limit} of ${rankedGpus.length} GPUs.`})
			}
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			if (multipleSearch === 's') {
				const filter = x => x.author.id === interaction.user.id && parseInt(x.content)
				return interaction.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ['time']}).then(responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return interaction.reply('That\'s not a valid number.');
					interaction.followUp({embeds: [gpuEmbed(client, rankedGpus[index][1], manufacturer || getManufacturer(rankedGpus[index][0]))], allowedMentions: { repliedUser: false }});
				}).catch(() => interaction.reply({content: 'You failed.', allowedMentions: { repliedUser: false }}))
			}
		} else {
			Object.entries(gpus).forEach(gpuList => {
				if (manufacturer) {
					if (manufacturer !== gpuList[0]) return;
				}
				gpuList[1].filter(x => x.name).forEach((gpu, key) => {
					gpus[gpuList[0]].get(key).score = rankGpu(gpu);
				});
			});
			let matches = {
				nvidia: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === 'nvidia') {
					matches.nvidia = gpus.nvidia.filter(x => x.name).find(x => gpus.nvidia.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === 'amd') {
					matches.amd = gpus.amd.filter(x => x.name).find(x => gpus.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.nvidia = gpus.nvidia.filter(x => x.name).find(x => gpus.nvidia.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = gpus.amd.filter(x => x.name).find(x => gpus.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === 'number' ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === 'number' ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return interaction.reply({content: 'That query returned `0` results.', allowedMentions: { repliedUser: false }});
			interaction.reply({embeds: [gpuEmbed(client, bestMatch[1], bestMatch[0])], allowedMentions: { repliedUser: false }});
		}
	}
	},
	data: new SlashCommandBuilder()
		.setName("gpu")
		.setDescription("Finds a GPU")
		.addSubcommand((optt)=>optt
			.setName("help")
			.setDescription("Shows you how to use the command"))
		.addSubcommand((optt)=>optt
			.setName("search")
			.setDescription("Searches GPUs")
			.addStringOption((opt)=>opt
				.setName("query")
				.setDescription("The GPU(s) to search for")
				.setRequired(true))
			.addStringOption(options => options
				.setName('options')
				.setDescription('Search options')
				.addChoice('Search a list you can view', 'sl')
				.addChoice('Search a list you can choose from', 's')
				.addChoice('Search for specific GPU specs', 'none')
				.setRequired(true)))
}