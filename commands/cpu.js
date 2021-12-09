function cpuEmbed(client, cpu, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === 'intel') color = '#40c7f7';
	else if (manufacturer.toLowerCase() === 'amd') color = 'cf4125';
	const embed = new client.embed()
		.setTitle(manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1).toLowerCase() + ' ' + cpu.name)
		.addField('Cores', cpu.cores, true)
		.addField('Base Clock Speed', cpu.base ? (cpu.base === 'N/A' ? 'N/A' : cpu.base + ' GHz') : 'N/A', true)
		.addField('TDP', cpu.tdp ? (cpu.tdp === 'N/A' ? 'N/A' : cpu.tdp + 'W') : 'N/A', true)
		.addField('Threads', cpu.threads ? (cpu.threads === 'N/A' ? 'N/A' : cpu.threads) : 'N/A', true)
		.addField('Boost Clock Speed', cpu.boost ? (cpu.boost === 'N/A' ? 'N/A' : cpu.boost + ' GHz') : 'N/A', true)
		.addField('Socket', cpu.socket ? (cpu.socket === 'N/A' ? 'N/A' : cpu.socket): 'N/A', true)
		.addField('MSRP', cpu.price ? (cpu.price === 'N/A' ? 'N/A' : '$' + cpu.price.toFixed(2)) : 'N/A')
		.setColor(color);
	return embed;
}

module.exports = {
	run: (client, message, args) => {
		// if no cpu was searched, tell user to do cpu help
		if (!args[1]) return message.channel.send('You need to search for a CPU. For help, do `' + client.prefix + 'cpu help`');
		// if they did help and didnt put anything else in the command, get help embed and send it
		if (args[1].toLowerCase() === 'help' && args.length === 2) {
			const embed = new client.embed()
			.setTitle('CPU Command Help')
			.setColor(client.embedColor)
			.setDescription('This command searches a list of real life CPUs and supplies you with technical information about them. This guide explains how to use this command properly.')
			.addField('Search Terms', 'Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a comma \`,\`.')
			.addField('Manufacturer Search', 'Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `intel` or `amd`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.')
			.addField('i dont want to write this', 'so here are examples\n\`,cpu intel 12900k, price > 589\`\n2 search terms, separated with a comma\nmanufacturer = intel (only intel cpus will be searched)\nname search = 12900k (cpu name must include "12900k")\nfilter: price > 1000 (cpu msrp must be more than 1000 usd)\n\n\`,cpu 6900\`\n1 search term\nno manufacturer, no filters\nnamesearch = 6900 (cpu name must include "6900")\n\n\`,cpu amd -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = amd\nmultiple search: list is active (\`-s\` also works)')
			return message.channel.send(embed);
		}
		const searchTerms = args.slice(1).join(' ').split(',');

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

		let manufacturer = firstSearchTermsParts[0].toLowerCase() === 'intel' ? 'intel' : firstSearchTermsParts[0].toLowerCase() === 'amd' ? 'amd' : undefined;

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
				message.channel.send(`Invalid operator in \`${property + operator + value}\``);
				return false;
			}
			if (!property || !['name', 'price', 'cores', 'base', 'boost', 'threads', 'tdp', 'socket'].includes(property.toLowerCase())) {
				message.channel.send(`Invalid property in \`${property + operator + value}\``);
				return false;
			}
			if (!value) {
				message.channel.send(`Invalid value in \`${property + operator + value}\``);
				return false;
			}
			if (property === 'threads' || property === 'base') {
				if (operator !== '=') {
					message.channel.send(`Invalid operator in \`${property + operator + value}\` because that property only works with \`=\` operator`);
					return false;
				} else {
					return { property, operator, value };
				}
			} else {
				return { property, operator, value };
			}
		});
		if (filters.find(x => !x) !== undefined) return;
		const cpus = (() => {
			if (manufacturer) {
				if (manufacturer === 'intel') {
					return { intel: new client.collection(Object.entries(require('../databases/cpulist-INTEL.json'))) };
				} else if (manufacturer === 'amd') {
					return { amd: new client.collection(Object.entries(require('../databases/cpulist-AMD.json'))) };
				}
			} else {
				return {
					intel: new client.collection(Object.entries(require('../databases/cpulist-INTEL.json'))),
					amd: new client.collection(Object.entries(require('../databases/cpulist-AMD.json')))
				};
			}
		})();
		function rankCpu(cpu) {
			let score = 0;
			if (nameSearch) {
				if (cpu.name.toLowerCase().replace(/ /g, '').includes(nameSearch)) {
					score += nameSearch.length / cpu.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const cpuProperty = cpu[filter.property];
				if (typeof cpuProperty === 'number') {
					if (filter.operator === '=') {
						if (cpuProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === '<') {
						if (cpuProperty < parseInt(filter.value)) filtersScore += cpuProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === '>') {
						if (cpuProperty > parseInt(filter.value)) filtersScore += 1 / (cpuProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === '~') {
						if (cpuProperty >= parseInt(filter.value) * 0.8 && cpuProperty <= parseInt(filter.value) * 1.2) {
							if (cpuProperty >= parseInt(filter.value)) filtersScore += 1 / (cpuProperty / parseInt(filter.value));
							else if (cpuProperty <= parseInt(filter.value)) filtersScore += cpuProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (cpuProperty.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(cpuKey) {
			if (cpus.amd.has(cpuKey)) return 'AMD';
			else if (cpus.intel.has(cpuKey)) return 'INTEL';
			else return undefined;
		}

		if (multipleSearch) {
			const rankedCpus = [];
			if (manufacturer) {
				cpus[manufacturer].filter(x => x.name).forEach((cpu, key) => {
					cpu.score = rankCpu(cpu);
					if (cpu.score < 0) return;
					rankedCpus.push([key, cpu]);
				});
			} else {
				Object.entries(cpus).forEach(manufacturerCpus => {
					manufacturerCpus[1].filter(x => x.name).forEach((cpu, key) => {
						cpu.score = rankCpu(cpu);
						if (cpu.score < 0) return;
						rankedCpus.push([key, cpu]);
					});
				});
			}
			rankedCpus.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle('Choose CPU')
				.setDescription('Your search returned many CPU\'s.' +( multipleSearch === 's' ? ' Choose one and respond with the corresponding number. (20s)' : ' Here is a list of the relevant top 20.'))
			if (manufacturer === 'intel') embed.setColor('#40c7f7');
			else if (manufacturer === 'amd') embed.setColor(13582629);
			else embed.setColor(client.embedColor);
			let text = '';
			const sliced = rankedCpus.slice(0, limit);
			if (filters.length === 0) sliced.sort((a, b) => a[0] < b[0]);
			sliced.forEach((cpu, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${cpu[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(cpu[0])} ${cpu[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addField('\u200b', text, true);
					text = '';
				}
				text += textAddition;
			});
			if (text.length > 0) {
				if (embed.fields.length > 0) {
					embed.addField('\u200b', text, true);
				} else {
					embed.description += '\n' + text;
				}
			}
			if (rankedCpus.length <= limit) {
				embed.setFooter(`Showing all ${rankedCpus.length} CPUs.`)
			} else {
				embed.setFooter(`Showing ${limit} of ${rankedCpus.length} CPUs.`)
			}
			message.channel.send(embed).then(x => setTimeout(() => x.edit('_Removed to save space._') && x.suppressEmbeds(), 90000));
			if (multipleSearch === 's') {
				return message.channel.awaitMessages(x => x.author.id === message.author.id && parseInt(x.content), { max: 1, time: 20000, errors: ['time']}).then(responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return message.channel.send('That\'s not a valid number.');
					message.channel.send(cpuEmbed(client, rankedCpus[index][1], manufacturer || getManufacturer(rankedCpus[index][0])));
				}).catch(() => message.channel.send('You failed.'))
			}
		} else {
			Object.entries(cpus).forEach(cpuList => {
				if (manufacturer) {
					if (manufacturer !== cpuList[0]) return;
				}
				cpuList[1].filter(x => x.name).forEach((cpu, key) => {
					cpus[cpuList[0]].get(key).score = rankCpu(cpu);
				});
			});
			let matches = {
				intel: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === 'intel') {
					matches.intel = cpus.intel.filter(x => x.name).find(x => cpus.intel.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === 'amd') {
					matches.amd = cpus.amd.filter(x => x.name).find(x => cpus.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.intel = cpus.intel.filter(x => x.name).find(x => cpus.intel.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = cpus.amd.filter(x => x.name).find(x => cpus.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === 'number' ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === 'number' ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return message.channel.send('That query returned `0` results.');
			message.channel.send(cpuEmbed(client, bestMatch[1], bestMatch[0]));
		}
	},
	name: 'cpu',
	description: 'Info about IRL CPUs.',
	usage: ['"help" / manufacturer', 'name', 'filter', '?"-s" / "-sl"'],
	category: 'Real Computers',
	cooldown: 7
}
